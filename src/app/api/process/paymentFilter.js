export default function separateInvoicesByPaymentMethod(invoices) {
    const invoicesByPaymentMethod = {};

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
    return invoicesByPaymentMethod
}

// const fac = {
//     '01': [
//         {
//             'UDDI': '001',
//         }
//     ],
//     '02': [],
//     '03': [],
// }
