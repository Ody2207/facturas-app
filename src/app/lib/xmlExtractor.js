import xml2js from "xml2js";
import { promises as fs } from "fs";
import path from "path";
import separateInvoicesByPaymentMethod from './paymentFilter';
import createExcelFile from './excelGenerator.js'
import { tmpdir } from 'os';


async function leerArchivosXML(carpeta) {
    try {
        const archivos = await fs.readdir(carpeta);
        const archivosXML = archivos.filter(
            (archivo) => path.extname(archivo).toLowerCase() === ".xml"
        );

        const promesasLectura = archivosXML.map((archivo) =>
            fs.readFile(path.join(carpeta, archivo), "utf8")
        );

        const xmlStrings = await Promise.all(promesasLectura);
        console.log(`Se han leído ${xmlStrings.length} archivos XML.`);
        return xmlStrings;
    } catch (error) {
        console.error("Error al leer los archivos XML:", error);
        throw error;
    }
}

async function xmlToJson(xmlString) {
    try {
        const result = await xml2js.parseStringPromise(xmlString, xmlParserOptions);
        const comprobante = result["cfdi:Comprobante"];
        return {
            UUID: extractUUID(comprobante),
            Version: comprobante.Version,
            Fecha: comprobante.Fecha,
            Total: comprobante.Total,
            SubTotal: comprobante.SubTotal,
            Moneda: comprobante.Moneda,
            TipoDeComprobante: comprobante.TipoDeComprobante,
            MetodoPago: comprobante.MetodoPago,
            FormaPago: comprobante.FormaPago,
            Emisor: extractEmisor(comprobante),
            Receptor: extractReceptor(comprobante),
            Conceptos: extractConceptos(comprobante),
        };
    } catch (error) {
        console.error("Error al convertir XML a JSON:", error);
        throw error;
    }
}

function extractUUID(comprobante) {
    const complemento = comprobante["cfdi:Complemento"];
    return complemento?.["tfd:TimbreFiscalDigital"]?.UUID || "No disponible";
}

function extractEmisor(comprobante) {
    const emisor = comprobante["cfdi:Emisor"];
    return {
        Rfc: emisor.Rfc,
        Nombre: emisor.Nombre,
        RegimenFiscal: emisor.RegimenFiscal,
    };
}

function extractReceptor(comprobante) {
    const receptor = comprobante["cfdi:Receptor"];
    return {
        Rfc: receptor.Rfc,
        Nombre: receptor.Nombre,
        UsoCFDI: receptor.UsoCFDI,
    };
}

function extractConceptos(comprobante) {
    let conceptos = comprobante["cfdi:Conceptos"]["cfdi:Concepto"];
    if (!Array.isArray(conceptos)) conceptos = [conceptos];

    return conceptos.map((concepto) => ({
        ClaveProdServ: concepto.ClaveProdServ,
        Cantidad: concepto.Cantidad,
        ClaveUnidad: concepto.ClaveUnidad,
        Descripcion: concepto.Descripcion,
        ValorUnitario: concepto.ValorUnitario,
        Importe: concepto.Importe,
    }));
}

async function procesarFacturas(xmlStrings) {
    const resultados = await Promise.all(
        xmlStrings.map(async (xml) => {
            try {
                return await xmlToJson(xml);
            } catch {
                return null;
            }
        })
    );

    return resultados.filter(Boolean);
}

export default async function main() {
    try {
      const xmlStrings = await obtenerXMLsDesdeGoogleDrive(); // <-- actualizado
      const facturas = await procesarFacturas(xmlStrings);
      const facturasFiltradas = separateInvoicesByPaymentMethod(facturas);
      createExcelFile(facturasFiltradas);
  
      return 'Archivo generado con éxito';
    } catch (error) {
      console.error("Error en el proceso principal:", error);
      throw error;
    }
}