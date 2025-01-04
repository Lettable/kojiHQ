import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    const filePath = path.join(process.cwd(), '/src/lib/utils/', 'emojis.json');

    const data = await fs.promises.readFile(filePath, 'utf8');

    const emojis = JSON.parse(data);

    return NextResponse.json(emojis);
  } catch (error) {
    return NextResponse.json({ error: `Failed to read data ${error}` }, { status: 500 });
  }
}