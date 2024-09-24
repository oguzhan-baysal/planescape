import { NextResponse } from 'next/server';
import axios from 'axios';
import { connectToDatabase } from '@/lib/mongodb';

const SCHIPHOL_API_URL = 'https://api.schiphol.nl/public-flights/flights';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const direction = searchParams.get('direction');

    const response = await axios.get(SCHIPHOL_API_URL, {
      headers: {
        'app_id': process.env.SCHIPHOL_APP_ID,
        'app_key': process.env.SCHIPHOL_APP_KEY,
        'Accept': 'application/json',
        'ResourceVersion': 'v4'
      },
      params: {
        scheduleDate: date,
        flightDirection: direction
      }
    });

    const flights = response.data.flights.map((flight: { id: string; flightName: string; route: { destinations: string[] }; scheduleDateTime: string; flightDirection: string; }) => ({
      id: flight.id,
      flightNumber: flight.flightName,
      route: {
        destinations: flight.route.destinations
      },
      scheduleDateTime: flight.scheduleDateTime,
      flightDirection: flight.flightDirection
    }));

    // Veritabanına uçuşları kaydet
    const client = await connectToDatabase();
    const db = client.db();
    
    for (const flight of flights) {
      await db.collection('flights').updateOne(
        { id: flight.id },
        { $set: flight },
        { upsert: true }
      );
    }

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Uçuş verisi alma hatası:', error);
    return NextResponse.json({ error: 'Uçuş verileri alınamadı' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const { id, flightDetails } = await request.json();

    console.log('Received id:', id);
    console.log('Received flightDetails:', flightDetails);

    const result = await db.collection('flights').updateOne(
      { id: id },
      { $set: flightDetails }
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      console.log('Flight not found with id:', id);
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    console.log('Flight updated successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update flight:', error);
    return NextResponse.json({ error: 'Failed to update flight' }, { status: 500 });
  }
}