// app/api/privacyAgree
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// 개인정보 동의 여부 업데이트 처리 함수
export async function PUT(req: Request) {
    const { userId, privacy_consent } = await req.json();
  
  
    // privacy_consent 값이 'O' 또는 'X'인지 확인
    if (!['O', 'X'].includes(privacy_consent)) {
      return NextResponse.json({ error: '동의 값이 올바르지 않습니다. O 또는 X여야 합니다.' }, { status: 400 });
    }
  
    // 개인정보 동의 여부 업데이트
    try {
        const result = await sql`
    UPDATE Members
    SET members_privacy_consent = ${privacy_consent}
    WHERE members_id = ${userId}
    RETURNING *
  `;

  console.log('Update result:', result);  // 쿼리 결과 로그 출력
  
  if (result.rows.length > 0) {
    const { members_book_id } = result.rows[0]; // members_book_id 추출
    return NextResponse.json({ message: '개인정보 제공 동의 여부가 성공적으로 업데이트되었습니다.', members_book_id });
  } else {
    return NextResponse.json({ error: '회원 정보를 찾을 수 없습니다.' }, { status: 404 });
  }
} catch (error) {
  console.error('개인정보 제공 동의 여부 업데이트 중 오류 발생:', error);
  return NextResponse.json({ error: '개인정보 제공 동의 여부 업데이트에 실패했습니다.' }, { status: 500 });
}
}
  