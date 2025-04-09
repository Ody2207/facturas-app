import main from '@/app/lib/xmlExtractor';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resultado = await main();
    return NextResponse.json({ message: resultado, downloadUrl: '/excel/facturas.xlsx' });
  } catch (error) {
    console.error("Error procesando XMLs:", error);
    return NextResponse.json({ message: "Error al procesar los XMLs" }, { status: 500 });
  }
}