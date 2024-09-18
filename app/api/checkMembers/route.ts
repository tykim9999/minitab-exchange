import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'; // Vercel의 PostgreSQL 연결

export async function POST(request: Request) {
  try {
    // 클라이언트에서 보낸 데이터를 JSON 형식으로 파싱
    const { members_name, members_phone_number } = await request.json();

    // 필수 항목 확인
    if (!members_name || !members_phone_number) {
      return NextResponse.json({ success: false, message: '이름과 전화번호는 필수입니다.' });
    }

    // SQL 쿼리를 실행하여 이름과 전화번호로 회원 정보 조회
    const result = await sql`
      SELECT members_id, members_name, members_phone_number, members_winner_status, members_book_id
      FROM Members
      WHERE members_name = ${members_name} AND members_phone_number = ${members_phone_number}
    `;

    // 회원 정보가 없을 때 처리
    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: '회원 정보가 없습니다.' });
    }

    // 조회된 회원 정보
    const member = result.rows[0];

    // 조회된 결과에 따라 기프티콘 당첨 여부 및 받은 책 ID 등을 반환
    return NextResponse.json({
      success: true,
      member: {
        userId: member.members_id,
        name: member.members_name,
        phoneNumber: member.members_phone_number,
        winnerStatus: member.members_winner_status,  // 'O' 또는 'X' 값
        bookId: member.members_book_id  // 받은 책 ID
      }
    });
  } catch (error) {
    console.error('Error fetching member data:', error);
    return NextResponse.json({ success: false, message: '에러가 발생했습니다.', error });
  }
}
