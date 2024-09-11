// app/api/members.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// 유효성 검사 함수
function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\d{11}$/;  // 11자리 숫자만 허용
  return phoneRegex.test(phoneNumber);
}

export async function POST(req: Request) {
  const { members_name, members_phone_number, members_company, members_message } = await req.json();

  // 필수 항목 확인
  if (!members_name || !members_phone_number) {
    return NextResponse.json({ error: '이름과 전화번호는 필수입니다.' }, { status: 400 });
  }

  // 핸드폰 번호 유효성 검사
  if (!validatePhoneNumber(members_phone_number)) {
    return NextResponse.json({ error: '핸드폰 번호는 11자리 숫자여야 합니다.' }, { status: 400 });
  }

  try {
    // 전화번호 중복 확인
    const phoneCheckResult = await sql`SELECT * FROM Members WHERE members_phone_number = ${members_phone_number}`;
    if (phoneCheckResult.rows.length > 0) {
      return NextResponse.json({ error: '이미 사용 중인 전화번호입니다.' }, { status: 400 });
    }

    // book_id 3과 4의 현재 수량을 가져옴
    const book1CountResults = await sql`SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 5`;
    const book2CountResults = await sql`SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 6`;

    const book1Count = book1CountResults.rows[0]?.count || 0;
    const book2Count = book2CountResults.rows[0]?.count || 0;

    let assignedBookId: number;

    // 두 권의 책 모두 60권 미만일 경우 랜덤 배정
    if (book1Count < 60 && book2Count < 60) {
      assignedBookId = Math.random() < 0.5 ? 5 : 6;
    } else if (book1Count >= 60) {
      // book_id 3이 60권을 초과한 경우 book_id 4로 배정
      assignedBookId = 6;
    } else {
      // book_id 4가 60권을 초과한 경우 book_id 3으로 배정
      assignedBookId = 5;
    }

    // 선택된 책의 재고 확인
    const bookStockResults = await sql`SELECT books_quantity AS stock FROM Books WHERE books_id = ${assignedBookId}`;
    const bookStock = bookStockResults.rows[0]?.stock;

    if (bookStock <= 0) {
      return NextResponse.json({ error: '선택된 책의 재고가 부족합니다.' }, { status: 400 });
    }

    // 회원 정보 삽입
    const result = await sql`
      INSERT INTO Members (members_name, members_phone_number, members_company, members_message, members_privacy_consent, members_book_id) 
      VALUES (${members_name}, ${members_phone_number}, ${members_company}, ${members_message}, NULL, ${assignedBookId})
      RETURNING members_id
    `;

    // 회원 정보가 성공적으로 저장된 후 책 재고를 감소
    await sql`UPDATE Books SET books_quantity = books_quantity - 1 WHERE books_id = ${assignedBookId}`;

    // 회원 ID 반환
    if (result.rows.length > 0) {
      return NextResponse.json({ message: '회원 정보가 성공적으로 저장되었으며, 책이 할당되었습니다.', userId: result.rows[0].members_id, book_id: assignedBookId });
    } else {
      return NextResponse.json({ error: '회원 정보 저장에 실패했습니다.' }, { status: 500 });
    }

  } catch (error) {
    console.error('회원 정보 저장 실패:', error);
    return NextResponse.json({ error: '회원 정보 저장 실패' }, { status: 500 });
  }
}
