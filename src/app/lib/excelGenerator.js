const XlsxPopulate = require('xlsx-populate');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'public', 'excel', 'facturas.xlsx');

export default async function createExcelFile(facturasFiltradas) {
  try {
    const formasPago = Object.keys(facturasFiltradas);
    const workbook = await XlsxPopulate.fromBlankAsync();
    workbook.sheet(0).name('Resumen');

    // Crear una hoja por forma de pago
    formasPago.forEach((formaPago) => {
      workbook.addSheet(formaPago);
    });

    for (let i = 0; i < formasPago.length; i++) {
      const formaPago = formasPago[i];
      const facturas = facturasFiltradas[formaPago];
      const sheet = workbook.sheet(i + 1);

      const headers = [
        'UUID', 'FECHA', 'TOTAL', 'SUBTOTAL', 'MONEDA',
        'TIPO DE COMPROBANTE', 'METODO DE PAGO', 'FORMA DE PAGO',
        'EMISOR: RFC', 'EMISOR: NOMBRE', 'EMISOR: REGIMEN FISCAL',
        'RECEPTOR: RFC', 'RECEPTOR: NOMBRE', 'RECEPTOR: USO CFDI'
      ];

      headers.forEach((header, col) => {
        sheet.cell(1, col + 1).value(header);
      });

      facturas.forEach((item, row) => {
        const values = [
          item.UUID,
          item.Fecha,
          item.Total,
          item.SubTotal,
          item.Moneda,
          item.TipoDeComprobante,
          item.MetodoPago,
          item.FormaPago,
          item.Emisor.Rfc,
          item.Emisor.Nombre,
          item.Emisor.RegimenFiscal,
          item.Receptor.Rfc,
          item.Receptor.Nombre,
          item.Receptor.UsoCFDI
        ];

        values.forEach((value, col) => {
          sheet.cell(row + 2, col + 1).value(value);
        });
      });
    }

    await workbook.toFileAsync(filePath);
    console.log('📁 Excel generado correctamente:', filePath);
  } catch (err) {
    console.error('❌ Error al generar el Excel:', err);
    throw err;
  }
}