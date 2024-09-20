import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres'; // Vercel의 PostgreSQL 연결

export async function POST(request: Request) {
  try {
    // 클라이언트에서 보낸 데이터를 JSON 형식으로 파싱
    const { members_phone_number } = await request.json();

    // SQL 쿼리를 실행하여 전화번호로 회원 정보 조회
    const result = await sql`
      SELECT members_phone_number
      FROM Members
      WHERE members_phone_number = ${members_phone_number}
    `;

    // 회원 정보가 있을 때 처리 (이미 응모한 전화번호)
    if (result.rows.length > 0) {
      return NextResponse.json({ success: false, message: '이미 응모한 전화번호입니다.' });
    }

    // 전화번호가 존재하지 않을 경우 (새로운 응모)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error fetching member data:', error);
    return NextResponse.json({ success: false, message: '에러가 발생했습니다.', error });
  }
}
