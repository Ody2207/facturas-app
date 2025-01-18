export default function separateInvoicesByPaymentMethod(invoices) {
    const invoicesByPaymentMethod = {};

    invoices.forEach((invoice) => {
        const paymentMethod = invoice.FormaPago;
        if (!invoicesByPaymentMethod[paymentMethod]) {
            invoicesByPaymentMethod[paymentMethod] = [];
        }
        invoicesByPaymentMethod[paymentMethod].push(invoice);
    });

    console.log(invoicesByPaymentMethod)
    return invoicesByPaymentMethod
}