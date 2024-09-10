import { NextResponse } from 'next/server';
import db from '@/lib/db'; // DB 연결 모듈 가정
import { RowDataPacket } from 'mysql2'; // mysql2의 RowDataPacket 타입을 가져옵니다

// 쿼리 결과를 타입으로 정의
interface BookCountResult extends RowDataPacket {
  count: number;
}

interface BookStockResult extends RowDataPacket {
  stock: number;
}

// 유효성 검사 함수
function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^\d{11}$/;  // 11자리 숫자만 허용
  return phoneRegex.test(phoneNumber);
}

export async function POST(req: Request) {
  // 요청 바디에서 회원 정보 추출
  const { members_name, members_phone_number, members_company, members_message } = await req.json();

  if (!members_name || !members_phone_number) {
    return NextResponse.json({ error: '이름과 전화번호는 필수입니다.' }, { status: 400 });
  }

  // 1. 핸드폰 번호 유효성 검사
  if (!validatePhoneNumber(members_phone_number)) {
    return NextResponse.json({ error: '핸드폰 번호를 다시 입력해주세요.' }, { status: 400 });
  }

  const connection = await db.getConnection(); // 트랜잭션을 위한 연결
  try {
    await connection.beginTransaction();

    // book_id 1과 2의 현재 수량을 가져옵니다
    const [book1CountResults] = await connection.query<BookCountResult[]>(`SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 1`);
    const [book2CountResults] = await connection.query<BookCountResult[]>(`SELECT COUNT(*) AS count FROM Members WHERE members_book_id = 2`);

    const book1Count = book1CountResults[0].count;
    const book2Count = book2CountResults[0].count;

    let assignedBookId: number;

    // 둘 다 60권 미만일 경우 랜덤 배정
    if (book1Count < 60 && book2Count < 60) {
      assignedBookId = Math.random() < 0.5 ? 1 : 2;
    } else if (book1Count >= 60) {
      // book_id 1이 이미 60권이면 book_id 2 배정
      assignedBookId = 2;
    } else {
      // book_id 2가 이미 60권이면 book_id 1 배정
      assignedBookId = 1;
    }

    // 선택된 책의 재고 확인
    const [bookStockResults] = await connection.query<BookStockResult[]>(`SELECT books_quantity AS stock FROM Books WHERE books_id = ? FOR UPDATE`, [assignedBookId]);

    const bookStock = bookStockResults[0].stock;

    if (bookStock <= 0) {
      // 재고가 없는 경우 오류 반환
      throw new Error('선택된 책의 재고가 부족합니다.');
    }

    // 회원 데이터를 Members 테이블에 삽입
    await connection.query(
      `INSERT INTO Members (members_name, members_phone_number, members_company, members_message, members_book_id) VALUES (?, ?, ?, ?, ?)`,
      [members_name, members_phone_number, members_company, members_message, assignedBookId]
    );

    // 책 재고를 1 감소
    await connection.query(`UPDATE Books SET books_quantity = books_quantity - 1 WHERE books_id = ?`, [assignedBookId]);

    // 트랜잭션 커밋
    await connection.commit();

    return NextResponse.json({ message: '회원 정보가 성공적으로 저장되었으며, 책이 할당되었습니다.', book_id: assignedBookId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: '핸드폰 번호가 이미 존재합니다!' }, { status: 500 });
  } finally {
    connection.release(); // 연결 해제
  }
}
