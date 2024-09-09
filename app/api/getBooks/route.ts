// app/api/getData/getBooks.ts
import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET() {
  try {
    // 모든 테이블 이름을 가져오는 쿼리
    const [table] = await db.query('Show tables');
    
    // 테이블 목록을 JSON 형태로 반환
    return NextResponse.json({ table });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
