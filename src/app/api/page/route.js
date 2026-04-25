import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(re) {
  const { searchParams } = re.nextUrl;
  const url = searchParams.get('url');

  if (!url) return NextResponse.json({ error: 404 }, { status: 404 });

  const { data, headers } = await axios({
    url: url,
    method: 'GET',
    responseType: 'arraybuffer',
  });

  return new NextResponse(data, {
    headers: {
      'Content-Type': headers['Content-Type'],
    },
  });
}
