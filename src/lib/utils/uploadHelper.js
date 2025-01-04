import path from 'path';
import fs from 'fs';

export async function uploadFile(file) {
  try {
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);

    fs.writeFileSync(filePath, Buffer.from(fileBuffer));
    return fileName;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
}
