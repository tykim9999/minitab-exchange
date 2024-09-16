// app/api/getUserName.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const userId = req.headers.get('user-id'); // 헤더에서 user-id 값을 추출
  

  if (!userId) {
    return NextResponse.json({ error: 'user_id가 필요합니다.' }, { status: 400 });
  }

  try {
    // user_id로 회원 이름 조회
    const result = await sql`SELECT members_name FROM Members WHERE members_id = ${userId}`;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ name: result.rows[0].members_name });
   }catch (error) {
    console.error('회원 이름 조회 실패:', error);
    return NextResponse.json({ error: '회원 이름 조회에 실패했습니다.' }, { status: 500 });
  }
}
