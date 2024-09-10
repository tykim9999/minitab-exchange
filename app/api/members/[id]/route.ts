// // app/api/members/[id]/route.ts
// import { NextResponse } from 'next/server';
// import db from '@/lib/db'; // PostgreSQL 연결

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   try {
//     const result = await db.query('SELECT * FROM Members WHERE id = $1', [id]);
//     if (result.rowCount === 0) {
//       return NextResponse.json({ error: 'Member not found' }, { status: 404 });
//     }
//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching member:', error);
//     return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
//   }
// }

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   const { members_name, members_phone_number, members_company, members_message } = await req.json();
  
//   try {
//     const result = await db.query(
//       'UPDATE Members SET members_name = $1, members_phone_number = $2, members_company = $3, members_message = $4 WHERE id = $5',
//       [members_name, members_phone_number, members_company, members_message, id]
//     );
    
//     return NextResponse.json({ message: 'Member updated successfully' });
//   } catch (error) {
//     console.error('Error updating member:', error);
//     return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;

//   try {
//     await db.query('DELETE FROM Members WHERE id = $1', [id]);
//     return NextResponse.json({ message: 'Member deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting member:', error);
//     return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
//   }
// }
