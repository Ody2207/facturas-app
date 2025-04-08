import main from '@/app/lib/xmlExtractor.js';
import { NextResponse } from 'next/server';

export async function GET() {
    const result = await main();
    return NextResponse.json({ message: result });
}
