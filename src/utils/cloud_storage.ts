import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const uuid = uuidv4();

const client = process.env.GCP_CLIENT_EMAIL;
const key = process.env.GCP_PRIVATE_KEY;

if (!client) {
  throw new Error('Variable de enterno CCP_CLIENT_EMAIL no encontrada');
}

if (!key) {
  throw new Error('Variable de enterno CCP_PRIVATE_KEY no encontrada');
}

const b64 = process.env.GCP_SA_JSON_B64;
if (!b64) throw new Error('GCP_SA_JSON_B64 missing');

const sa = JSON.parse(Buffer.from(b64, 'base64').toString('utf8')) as {
  project_id: string;
  client_email: string;
  private_key: string;
};

const private_key = sa.private_key.replace(/\\n/g, '\n');

console.log('SA email:', sa.client_email);
console.log('Project:', sa.project_id);
console.log('Key header ok:', sa.private_key.includes('BEGIN PRIVATE KEY'));

const storage = new Storage({
  projectId: 'ecommerce-imagenes-3b10a',
  //keyFilename: './serviceAccountKey.json',
  credentials: {
    client_email: sa.client_email,
    private_key: private_key,
  },
});

const bucket = storage.bucket('ecommerce-imagenes-3b10a.firebasestorage.app');
// const bucket = storage.bucket('ecommerce-imagenes-3b10a.appspot.com');

/**
 * Subir archivo a Firebase Storage
 */
export default async function uploadFile(
  file: Express.Multer.File,
  pathImage: string,
): Promise<string> {
  const uuid = uuidv4();

  const fileUpload = bucket.file(pathImage);

  const writeStream = fileUpload.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
    metadata: {
      firebaseStorageDownloadTokens: uuid,
    },
  });

  // ✅ CAMBIO CLAVE PARA VERCEL
  await pipeline(Readable.from(file.buffer), writeStream);

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    fileUpload.name,
  )}?alt=media&token=${uuid}`;
}
