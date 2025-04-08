const XlsxPopulate = require('xlsx-populate')
const path = require('path')
const fs = require('fs')

const filePath = path.join(process.cwd(), 'public', 'excel')

function validarExcelFile() {
    const file = `${filePath}/facturas.xlsx`
    return fs.existsSync(file)
}

async function writeFile(data) {
    try {
        const formasPago = Object.keys(data)

        const workbook = await XlsxPopulate.fromBlankAsync()
        workbook.sheet(0).name('Resumen')

        formasPago.map(async (formaPago) => {
            workbook.addSheet(formaPago)
        })

        for(let i = 0; i < formasPago.length; i++) {
            const formaPago = formasPago[i]
            const facturas = data[formaPago]

            const sheet = workbook.sheet(i + 1)
            sheet.cell('A1').value('UUID')
            sheet.cell('B1').value('FECHA')
            sheet.cell('C1').value('TOTAL')
            sheet.cell('D1').value('SUBTOTAL')
            sheet.cell('E1').value('MONEDA')
            sheet.cell('F1').value('TIPO DE COMPROBANTE')
            sheet.cell('G1').value('METODO DE PAGO')
            sheet.cell('H1').value('FORMA DE PAGO')
            sheet.cell('I1').value('EMISOR: RFC')
            sheet.cell('J1').value('EMISOR: NOMBRE')
            sheet.cell('K1').value('EMISOR: REGIMEN FISCAL')
            sheet.cell('L1').value('RECEPTOR: RFC')
            sheet.cell('M1').value('RECEPTOR: NOMBRE')
            sheet.cell('N1').value('RECEPTOR: USO CFDI')

            facturas.map((item, j) => {
                sheet.cell(`A${j + 2}`).value(item.UUID)
                sheet.cell(`B${j + 2}`).value(item.Fecha)
                sheet.cell(`C${j + 2}`).value(item.Total)
                sheet.cell(`D${j + 2}`).value(item.SubTotal)
                sheet.cell(`E${j + 2}`).value(item.Moneda)
                sheet.cell(`F${j + 2}`).value(item.TipoDeComprobante)
                sheet.cell(`G${j + 2}`).value(item.MetodoPago)
                sheet.cell(`H${j + 2}`).value(item.FormaPago)
                sheet.cell(`I${j + 2}`).value(item.Emisor.Rfc)
                sheet.cell(`J${j + 2}`).value(item.Emisor.Nombre)
                sheet.cell(`K${j + 2}`).value(item.Emisor.RegimenFiscal)
                sheet.cell(`L${j + 2}`).value(item.Receptor.Rfc)
                sheet.cell(`M${j + 2}`).value(item.Receptor.Nombre)
                sheet.cell(`N${j + 2}`).value(item.Receptor.UsoCFDI)
            })
        }

        await workbook.toFileAsync(`${filePath}/facturas.xlsx`) 
    } catch (err) {
        console.log(err)
    }
}

// Funcion que valida y crea un archivo excel
export default function createExcelFile(facturas) {
    if(validarExcelFile()) {
        fs.unlinkSync(`${filePath}/facturas.xlsx`)
        writeFile(facturas)
    } else {
        writeFile(facturas)
    }
}
