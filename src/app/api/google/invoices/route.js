import { uploadToDrive } from "@/app/lib/googleDrive/googleDrive";
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
                const fileArray = Array.isArray(files.files)
                    ? files.files
                    : [files.files];
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

// Convierte Request del App Router a IncomingMessage
async function convertRequestToNodeReadable(request) {
    const body = await request.body;
    const readable = Readable.from(body);
    readable.headers = Object.fromEntries(request.headers.entries());
    readable.method = request.method;
    readable.url = request.url;
    return readable;
}
