// app/api/members.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// 유효성 검사 함수
function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\d{11}$/;  // 11자리 숫자만 허용
  return phoneRegex.test(phoneNumber);
}

export async function POST(req: Request) {
  const {
    members_name,
    members_phone_number,
    members_company,
    members_message,
    privacy_consent,
  } = await req.json();

  // 필수 항목 확인
  if (!members_name || !members_phone_number) {
    return NextResponse.json({ error: '이름과 전화번호는 필수입니다.' }, { status: 400 });
  }

  // 핸드폰 번호 유효성 검사
  if (!validatePhoneNumber(members_phone_number)) {
    return NextResponse.json({ error: '핸드폰 번호는 11자리 숫자여야 합니다.' }, { status: 400 });
  }

  // 개인정보 동의 여부 확인
  if (!privacy_consent || privacy_consent !== 'O') {
    return NextResponse.json({ error: '개인정보 제공에 동의하셔야 합니다.' }, { status: 400 });
  }

  // 개인정보 동의 값을 변수로 선언
  const members_privacy_consent = privacy_consent;

  try {
    // book_id 1과 2의 현재 수량을 가져옴
    const book1CountResults = await sql`
      SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 1
    `;
    const book2CountResults = await sql`
      SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 2
    `;

    const book1Count = parseInt(book1CountResults.rows[0]?.count || '0', 10);
    const book2Count = parseInt(book2CountResults.rows[0]?.count || '0', 10);

    let members_book_id: number;

    // 두 권의 책 모두 book1 = 92, book2 = 64권 미만일 경우 랜덤 배정
    if (book1Count < 92 && book2Count < 64) {
      members_book_id = Math.random() < 0.5 ? 1 : 2;
    } else if (book1Count >= 92 && book2Count < 64) {
      // book_id 1이 92권을 초과한 경우 book_id 2로 배정
      members_book_id = 2;
    } else if (book2Count >= 64 && book1Count < 92) {
      // book_id 2가 64권을 초과한 경우 book_id 1으로 배정
      members_book_id = 1;
    } else {
      return NextResponse.json({ error: '책의 재고가 모두 소진되었습니다.' }, { status: 400 });
    }

    // 선택된 책의 재고 확인
    const bookStockResults = await sql`
      SELECT books_quantity AS stock FROM Books WHERE books_id = ${members_book_id}
    `;
    const bookStock = parseInt(bookStockResults.rows[0]?.stock || '0', 10);

    if (bookStock <= 0) {
      return NextResponse.json({ error: '선택된 책의 재고가 부족합니다.' }, { status: 400 });
    }

    // 현재 당첨자 수와 참가자 수 확인
    const winnerCountResult = await sql`
      SELECT COUNT(*) AS winner_count FROM Members WHERE members_winner_status = 'O'
    `;
    const registeredCountResult = await sql`
      SELECT COUNT(*) AS registered_count FROM Members
    `;

    const winnerCount = parseInt(winnerCountResult.rows[0]?.winner_count || '0', 10);
    const registeredCount = parseInt(registeredCountResult.rows[0]?.registered_count || '0', 10);

    let members_winner_status = 'X';  // 기본값은 당첨되지 않음

    // 당첨자 수가 3명 미만일 경우 확률적으로 당첨자를 선정
    if (winnerCount < 3) {
      const remainingSpots = 3 - winnerCount;  // 남은 당첨자 자리
      const remainingParticipants = 156 - registeredCount;  // 남은 참가 가능 인원
      const probability = remainingSpots / remainingParticipants;  // 당첨 확률 계산

      // 확률에 따라 랜덤하게 당첨 여부 결정
      if (Math.random() < probability) {
        members_winner_status = 'O';  // 당첨자로 설정
      }
    }

    // 회원 정보 삽입
    const result = await sql`
      INSERT INTO Members (
        members_name,
        members_phone_number,
        members_company,
        members_message,
        members_privacy_consent,
        members_book_id,
        members_winner_status
      ) VALUES (
        ${members_name},
        ${members_phone_number},
        ${members_company},
        ${members_message},
        ${members_privacy_consent},
        ${members_book_id},
        ${members_winner_status}
      )
      RETURNING *
    `;

    // 회원 정보가 성공적으로 저장된 후 책 재고를 감소
    await sql`
      UPDATE Books SET books_quantity = books_quantity - 1 WHERE books_id = ${members_book_id}
    `;

    // 회원 ID 반환
    if (result.rows.length > 0) {
      const insertedMember = result.rows[0];
      return NextResponse.json({
        message: '회원 정보가 성공적으로 저장되었으며, 책이 할당되었습니다.',
        userId: insertedMember.members_id,
        members_book_id: insertedMember.members_book_id,
        winner_status: insertedMember.members_winner_status,
      });
    } else {
      return NextResponse.json({ error: '회원 정보 저장에 실패했습니다.' }, { status: 500 });
    }
  } catch (error) {
    console.error('회원 정보 저장 실패:', error);
    return NextResponse.json({ error: '회원 정보 저장 실패' }, { status: 500 });
  }
}
