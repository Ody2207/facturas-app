import { NextResponse } from 'next/server';
import { DOMParser } from 'xmldom';
import XlsxPopulate from 'xlsx-populate';

// Procesar XMLs a objetos
function procesarXMLs(xmlStrings) {
  const facturas = [];

  xmlStrings.forEach(xml => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      const comprobante = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
      const emisor = xmlDoc.getElementsByTagName("cfdi:Emisor")[0];
      const receptor = xmlDoc.getElementsByTagName("cfdi:Receptor")[0];
      const timbre = xmlDoc.getElementsByTagName("tfd:TimbreFiscalDigital")[0];

      if (!comprobante || !emisor || !receptor || !timbre) return;

      facturas.push({
        UUID: timbre.getAttribute("UUID") || "No disponible",
        Fecha: comprobante.getAttribute("Fecha") || "No disponible",
        Total: comprobante.getAttribute("Total") || "No disponible",
        SubTotal: comprobante.getAttribute("SubTotal") || "No disponible",
        Moneda: comprobante.getAttribute("Moneda") || "No disponible",
        TipoDeComprobante: comprobante.getAttribute("TipoDeComprobante") || "No disponible",
        MetodoPago: comprobante.getAttribute("MetodoPago") || "No disponible",
        FormaPago: comprobante.getAttribute("FormaPago") || "No disponible",
        Emisor: {
          Rfc: emisor.getAttribute("Rfc") || "No disponible",
          Nombre: emisor.getAttribute("Nombre") || "No disponible",
          RegimenFiscal: emisor.getAttribute("RegimenFiscal") || "No disponible",
        },
        Receptor: {
          Rfc: receptor.getAttribute("Rfc") || "No disponible",
          Nombre: receptor.getAttribute("Nombre") || "No disponible",
          UsoCFDI: receptor.getAttribute("UsoCFDI") || "No disponible",
        }
      });
    } catch (error) {
      console.error('❌ Error procesando XML:', error);
    }
  });

  return facturas;
}

// Generar buffer del Excel
async function crearExcelBuffer(facturas) {
  const workbook = await XlsxPopulate.fromBlankAsync();
  const sheet = workbook.sheet(0);

  const headers = [
    'UUID', 'FECHA', 'TOTAL', 'SUBTOTAL', 'MONEDA',
    'TIPO DE COMPROBANTE', 'METODO DE PAGO', 'FORMA DE PAGO',
    'EMISOR: RFC', 'EMISOR: NOMBRE', 'EMISOR: REGIMEN FISCAL',
    'RECEPTOR: RFC', 'RECEPTOR: NOMBRE', 'RECEPTOR: USO CFDI'
  ];

  headers.forEach((header, col) => {
    sheet.cell(1, col + 1).value(header);
  });

  facturas.forEach((factura, row) => {
    const values = [
      factura.UUID,
      factura.Fecha,
      factura.Total,
      factura.SubTotal,
      factura.Moneda,
      factura.TipoDeComprobante,
      factura.MetodoPago,
      factura.FormaPago,
      factura.Emisor.Rfc,
      factura.Emisor.Nombre,
      factura.Emisor.RegimenFiscal,
      factura.Receptor.Rfc,
      factura.Receptor.Nombre,
      factura.Receptor.UsoCFDI
    ];

    values.forEach((value, col) => {
      sheet.cell(row + 2, col + 1).value(value);
    });
  });

  return await workbook.outputAsync(); // Retorna buffer
}

// ✅ ESTA ES LA EXPORTACIÓN QUE NECESITA App Router
export async function POST(req) {
  try {
    const body = await req.json();
    const { xmlArray } = body;

    if (!xmlArray || !Array.isArray(xmlArray)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
    }

    const facturas = procesarXMLs(xmlArray);
    const buffer = await crearExcelBuffer(facturas);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="facturas.xlsx"',
      },
    });
  } catch (error) {
    console.error('❌ Error en API generar-excel:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
