import { uploadToDrive, deleteAllFromFolder} from "@/app/lib/googleDrive/googleDrive";
import { IncomingForm } from "formidable";
import { NextResponse } from "next/server";
import { Readable } from 'node:stream';


export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request) {
    const form = new IncomingForm({ multiples: true });

    const req = await convertRequestToNodeReadable(request);

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error al parsear:", err);
                return resolve(
                    NextResponse.json(
                        { message: "Error al procesar archivos" },
                        { status: 500 }
                    )
                );
            }

            try {
                let fileArray = [];
                for (const key in files) {
                    const value = files[key];
                    if (Array.isArray(value)) {
                        fileArray.push(...value);
                    } else if (value) {
                        fileArray.push(value);
                    }
                }

                if (fileArray.length > 200) {
                    return resolve(
                        NextResponse.json(
                            { message: "Demasiados archivos (máx. 200)" },
                            { status: 400 }
                        )
                    );
                }
                const uploadedIds = [];

                for (const file of fileArray) {
                    const fileId = await uploadToDrive(file);
                    uploadedIds.push(fileId);
                }

                return resolve(
                    NextResponse.json({
                        message: "Archivos subidos",
                        ids: uploadedIds,
                    })
                );
            } catch (error) {
                console.error("Error subiendo a Google Drive:", error);
                return resolve(
                    NextResponse.json(
                        { message: "Error interno" },
                        { status: 500 }
                    )
                );
            }
        });
    });
}


export async function DELETE() {
    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        const result = await deleteAllFromFolder(folderId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error al borrar archivos:", error);
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}

// Convierte Request del App Router a IncomingMessage
async function convertRequestToNodeReadable(request) {
    const body = await request.body;
    const readable = Readable.from(body);
    readable.headers = Object.fromEntries(request.headers.entries());
    readable.method = request.method;
    readable.url = request.url;
    return readable;
}

