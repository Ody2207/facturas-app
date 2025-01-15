const fs = require("fs");
const path = require("path");

// const getInvoices = async () => {
//     const res = await fetch('http://localhost:3000/json/facturas.json')
//     const data = await res.json()
//     return data
// }

export default function separateInvoicesByPaymentMethod(invoices) {
    // Leer el archivo JSON
    // const rawData = fs.readFileSync(getInvoices());
    // const invoices = JSON.parse(rawData);
    // const invoices = getInvoices();

    // Objeto para almacenar las facturas por forma de pago
    const invoicesByPaymentMethod = {};

    // Procesar cada factura
    invoices.forEach((invoice) => {
        const paymentMethod = invoice.FormaPago;
        if (!invoicesByPaymentMethod[paymentMethod]) {
            invoicesByPaymentMethod[paymentMethod] = [];
        }
        invoicesByPaymentMethod[paymentMethod].push(invoice);
    });

    // // Crear un archivo para cada forma de pago
    // for (const [paymentMethod, invoices] of Object.entries(
    //     invoicesByPaymentMethod
    // )) {
    //     const outputFilePath = `${filePath}/formas-pago/facturas_forma_pago_${paymentMethod}.json`;
    //     fs.writeFileSync(outputFilePath, JSON.stringify(invoices, null, 2));
    //     console.log(`Archivo creado: ${outputFilePath}`);
    // }
    console.log(invoicesByPaymentMethod)
}