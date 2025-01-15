import { writeFile, readdir, unlink } from "fs/promises";
import path, { extname } from "path";

export async function POST(req) {
    // Llamado del api desde el cliente
    const data = await req.formData();
    const files = data.getAll("files");

    // Guardar archivo en el servidor
    for (const file of files) {
        const extension = extname(file.name);

        if (extension !== ".xml") {
            return new Response(
                JSON.stringify({ error: "Archivo no válido" }),
                { status: 400 }
            );
        }

        // Guarda las extensiones permitidas
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Escribir archivo en el servidor
        const filePath = path.join(process.cwd(), 'public', 'xml', file.name);
        await writeFile(filePath, buffer);

    }

    console.log("Archivo guardado!");

    return new Response(
        JSON.stringify({
            message: "Archivo subido!",
        })
    );
}

export async function DELETE() {
    const directory = path.join(process.cwd(), 'public', 'xml');
  
    // Lee todos los archivos en el directorio
    const files = await readdir(directory);
    console.log(files);
  
    // Elimina los archivos del directorio
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directory, file);
        await unlink(filePath);
      })
    );
}
