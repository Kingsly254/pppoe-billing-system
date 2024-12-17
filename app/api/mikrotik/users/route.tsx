import { NextResponse } from 'next/server';
import { RouterOSClient } from 'routeros-client';

const client = new RouterOSClient({
  host: process.env.MIKROTIK_HOST,
  user: process.env.MIKROTIK_USER,
  password: process.env.MIKROTIK_PASSWORD,
});

export async function POST(req: Request) {
  try {
    const { username, password, profile } = await req.json();

    const conn = await client.connect();

    // Add PPPoE user
    await conn.menu('/ppp/secret').add({
      name: username,
      password: password,
      service: 'pppoe',
      profile: profile || 'default',
    });

    return NextResponse.json({ success: true, message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding PPPoE user:', error);
    return NextResponse.json({ success: false, message: 'Failed to add user' }, { status: 500 });
  } finally {
    client.close();
  }
}
