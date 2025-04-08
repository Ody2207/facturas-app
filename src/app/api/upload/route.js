import { writeFile, readdir, unlink } from "fs/promises";
import { tmpdir } from "os";
import path, { extname, join } from "path";

export async function POST(req) {
    const data = await req.formData();
    const files = data.getAll("files");

    for (const file of files) {
        const extension = extname(file.name);

        if (extension !== ".xml") {
            return new Response(
                JSON.stringify({ error: "Archivo no válido" }),
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const tempDir = tmpdir()
        const tempFilePath = join(tempDir, file.name)
        await writeFile(tempFilePath, buffer)

    }

    return new Response(
        JSON.stringify({
            message: "Archivo subido!",
        })
    );
}

export async function DELETE() {
    const directory = tmpdir();
  
    const files = await readdir(directory);
    console.log(files);
  
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directory, file);
        await unlink(filePath);
      })
    );
}
