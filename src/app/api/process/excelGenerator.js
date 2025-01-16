const XlsxPopulate = require('xlsx-populate')
const path = require('path')
// const { fstat } = require('fs')
const fs = require('fs')

const filePath = path.join(process.cwd(), 'public', 'excel')

// Validar si el archivo existe
function validarExcelFile() {
    const file = `${filePath}/facturas.xlsx`
    return fs.existsSync(file)
}

// Funcion que escribe en un archivo excel
export async function writeFile(data) {
    try {
        const formasPago = Object.keys(data)
        console.log(formasPago)

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
function createExcelFile() {
    
}

// async function newFile() {
//     try {
//         // Validamos si el archivo existe


//         // Si no existe, creamos un nuevo archivo
//         const workbook = await XlsxPopulate.fromBlankAsync(); 

//         await workbook.toFileAsync('./excels/factuas.xlsx')
//     } catch (err) {
//         console.log(err)
//     }
// }

// async function writeFile() {
//     try {
//         const workbook = await XlsxPopulate.fromBlankAsync('./excels/factuas.xlsx')
//         const factuas = data

//         workbook.sheet(0).cell('A2').value('UUID')
//         workbook.sheet(0).cell('B2').value('FECHA')
//         workbook.sheet(0).cell('C2').value('TOTAL')
//         workbook.sheet(0).cell('D2').value('SUBTOTAL')
//         workbook.sheet(0).cell('E2').value('MONEDA')
//         workbook.sheet(0).cell('F2').value('TIPO DE COMPROBANTE')
//         workbook.sheet(0).cell('G2').value('METODO DE PAGO')
//         workbook.sheet(0).cell('H2').value('FORMA DE PAGO')
//         workbook.sheet(0).cell('I2').value('EMISOR: RFC')
//         workbook.sheet(0).cell('J2').value('EMISOR: NOMBRE')
//         workbook.sheet(0).cell('K2').value('EMISOR: REGIMEN FISCAL')
//         workbook.sheet(0).cell('L2').value('RECEPTOR: RFC')
//         workbook.sheet(0).cell('M2').value('RECEPTOR: NOMBRE')
//         workbook.sheet(0).cell('N2').value('RECEPTOR: USO CFDI')

//         factuas.map((item, i) => {
//             workbook.sheet(0).cell(`A${i + 3}`).value(item.UUID)
//             workbook.sheet(0).cell(`B${i + 3}`).value(item.Fecha)
//             workbook.sheet(0).cell(`C${i + 3}`).value(item.Total)
//             workbook.sheet(0).cell(`D${i + 3}`).value(item.SubTotal)
//             workbook.sheet(0).cell(`E${i + 3}`).value(item.Moneda)
//             workbook.sheet(0).cell(`F${i + 3}`).value(item.TipoDeComprobante)
//             workbook.sheet(0).cell(`G${i + 3}`).value(item.MetodoPago)
//             workbook.sheet(0).cell(`H${i + 3}`).value(item.FormaPago)
//             workbook.sheet(0).cell(`I${i + 3}`).value(item.Emisor.Rfc)
//             workbook.sheet(0).cell(`J${i + 3}`).value(item.Emisor.Nombre)
//             workbook.sheet(0).cell(`K${i + 3}`).value(item.Emisor.RegimenFiscal)
//             workbook.sheet(0).cell(`L${i + 3}`).value(item.Receptor.Rfc)
//             workbook.sheet(0).cell(`M${i + 3}`).value(item.Receptor.Nombre)
//             workbook.sheet(0).cell(`N${i + 3}`).value(item.Receptor.UsoCFDI)

//         })
        
//         await workbook.toFileAsync('./excels/factuas.xlsx')
//         console.log('La escritura de los datos fue correcto')
//     } catch (err) {
//         console.log(err)
//     }
// }

// newFile()
// writeFile()