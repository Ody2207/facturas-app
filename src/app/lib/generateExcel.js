import { DOMParser } from 'xmldom';
import XlsxPopulate from 'xlsx-populate';
import path from 'path';
import { promises as fs } from 'fs';

const filePath = path.join(process.cwd(), 'public', 'excel', 'facturas.xlsx');

async function procesarXMLs(xmlStrings) {
    const facturas = [];

    xmlStrings.forEach(xml => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "application/xml");

            const comprobante = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
            const emisor = xmlDoc.getElementsByTagName("cfdi:Emisor")[0];
            const receptor = xmlDoc.getElementsByTagName("cfdi:Receptor")[0];
            const timbre = xmlDoc.getElementsByTagName("tfd:TimbreFiscalDigital")[0];

            if (!comprobante || !emisor || !receptor || !timbre) {
                console.warn("Archivo XML no tiene estructura válida");
                return;
            }

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
            console.error("Error al procesar un XML:", error);
        }
    });

    return facturas;
}

function separarPorFormaPago(facturas) {
    const agrupado = {};

    facturas.forEach(factura => {
        const forma = factura.FormaPago || "DESCONOCIDO";
        if (!agrupado[forma]) agrupado[forma] = [];
        agrupado[forma].push(factura);
    });

    return agrupado;
}

async function crearExcel(agrupado) {
    const workbook = await XlsxPopulate.fromBlankAsync();
    workbook.sheet(0).name('Resumen');

    const formas = Object.keys(agrupado);
    formas.forEach((forma) => {
        workbook.addSheet(forma);
    });

    for (let i = 0; i < formas.length; i++) {
        const formaPago = formas[i];
        const facturas = agrupado[formaPago];
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
    }

    await workbook.toFileAsync(filePath);
    console.log("📁 Excel generado en:", filePath);
}

export default async function generarExcelDesdeArray(xmlArray) {
    try {
        const facturas = await procesarXMLs(xmlArray);
        const agrupado = separarPorFormaPago(facturas);
        await crearExcel(agrupado);
        return "✅ Excel generado correctamente.";
    } catch (error) {
        console.error("❌ Error en el proceso:", error);
        throw error;
    }
}
