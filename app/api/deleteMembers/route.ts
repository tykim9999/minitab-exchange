import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json(); // 요청 본문에서 userId를 받아옴
    console.log("Received userId for deletion:", userId); // userId 확인 로그

    if (!userId) {
      return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
    }

    // 회원 데이터 삭제
    const result = await sql`
      DELETE FROM Members
      WHERE members_id = ${userId}
      RETURNING *
    `;

    console.log(result); // 반환된 result 객체의 구조를 확인

    // 삭제가 성공했는지 확인 (result.rows.length가 0보다 크면 삭제 성공)
    if (result.rows.length > 0) {
      return NextResponse.json({ message: '회원 정보가 성공적으로 삭제되었습니다.' });
    } else {
      return NextResponse.json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('회원 정보 삭제 실패:', error);
    return NextResponse.json({ error: '회원 정보 삭제 실패' }, { status: 500 });
  }
}
