import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const reservations = await db.collection('reservations').find({}).toArray();
    
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const { flightId, userId, flightDetails } = await request.json();
    
    const result = await db.collection('reservations').insertOne({
      flightId,
      userId,
      flightDetails,
      createdAt: new Date()
    });
    
    return NextResponse.json({ success: true, reservationId: result.insertedId });
  } catch (error) {
    console.error('Failed to create reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}