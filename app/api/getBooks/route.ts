// app/api/getData/getBooks.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // books 테이블에서 모든 데이터를 가져오는 쿼리
    const result = await sql`SELECT * FROM books;`;
    
    // 가져온 데이터를 JSON 형태로 반환
    return NextResponse.json({ tables: result.rows });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
