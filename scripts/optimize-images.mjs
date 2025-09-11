
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const publicDir = path.resolve(process.cwd(), 'public');
const optimizedDir = path.resolve(publicDir, 'optimized');

async function optimizeImages() {
  try {
    await fs.mkdir(optimizedDir, { recursive: true });

    const files = await fs.readdir(publicDir, { recursive: true });

    for (const file of files) {
      const filePath = path.join(publicDir, file);
      const fileStat = await fs.stat(filePath);

      if (fileStat.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(file)) {
        const optimizedFilePath = path
          .join(optimizedDir, file)
          .replace(/\.(?:webp|jpe?g|png)$/i, '.webp');
        await fs.mkdir(path.dirname(optimizedFilePath), { recursive: true });

        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(optimizedFilePath);

        console.log(`Optimized ${file}`);
      }
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
