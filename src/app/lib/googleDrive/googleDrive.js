import fs from 'fs';
import { google } from 'googleapis';

const apiKey = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URIS,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const SCOPE = ["https://www.googleapis.com/auth/drive"];

export async function uploadToDrive(file) {
  const auth = new google.auth.GoogleAuth({
    credentials: apiKey,
    scopes: SCOPE,
  });

  const authClient = await auth.getClient();
  const drive = google.drive({ version: "v3", auth: authClient });

  const fileMetadata = {
    name: file.originalFilename,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  };

  const media = {
    mimeType: "application/xml",
    body: fs.createReadStream(file.filepath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id",
  });

  return response.data.id;
}

// export async function deleteAllFromFolder(folderId) {
//   const auth = new google.auth.GoogleAuth({
//     scopes: ["https://www.googleapis.com/auth/drive"],
//   });

//   const drive = google.drive({ version: "v3", auth: await auth.getClient() });

//   // 1. Obtener todos los archivos de la carpeta
//   const files = [];
//   let pageToken = null;

//   do {
//     const res = await drive.files.list({
//       q: `'${folderId}' in parents and trashed = false`,
//       fields: "files(id, name), nextPageToken",
//       pageSize: 1000,
//       pageToken,
//     });

//     files.push(...res.data.files);
//     pageToken = res.data.nextPageToken;
//   } while (pageToken);

//   // 2. Borrar en grupos de 5
//   const chunkArray = (arr, size) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += size) {
//       result.push(arr.slice(i, i + size));
//     }
//     return result;
//   };

//   const chunks = chunkArray(files, 5);
//   const results = [];

//   for (const chunk of chunks) {
//     const deletions = await Promise.allSettled(
//       chunk.map(file => drive.files.delete({ fileId: file.id }))
//     );

//     results.push(...deletions);
//     await new Promise(resolve => setTimeout(resolve, 500)); // pequeña pausa para evitar throttling
//   }

//   const deletedCount = results.filter(r => r.status === "fulfilled").length;

//   return {
//     message: `Se eliminaron ${deletedCount} archivos de la carpeta.`,
//     total: files.length,
//     fallidos: files.length - deletedCount,
//   };
// }

export async function deleteAllFromFolder(folderId) {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: apiKey,
            scopes: SCOPE,
        });

        const authClient = await auth.getClient();
        const drive = google.drive({ version: "v3", auth: authClient });

        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: "files(id, name)",
        });

        const files = res.data.files;

        if (!files.length) {
            return { message: "No hay archivos para borrar", deleted: 0 };
        }

        let deletedCount = 0;

        // 2. Eliminar archivos uno por uno
        for (const file of files) {
            await drive.files.delete({ fileId: file.id });
            deletedCount++;
        }

        return {
            message: `Se eliminaron ${deletedCount} archivos.`,
            deleted: deletedCount,
        };
    } catch (err) {
        console.log(err);
    }
}
  