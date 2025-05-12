// Script para optimizar imágenes
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGE_DIRS = [
  'public/images/services',
  'public/images/testimonials',
  'public/images/resources',
  'public/images/clients',
];

const SIZES = [320, 640, 768, 1024, 1280, 1536];
const FORMATS = ['webp', 'avif'];

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  for (const dir of IMAGE_DIRS) {
    try {
      console.log(`Processing directory: ${dir}`);
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        if (file.startsWith('.') || !file.match(/\.(jpg|jpeg|png)$/i)) continue;
        
        const filePath = path.join(dir, file);
        const fileExt = path.extname(file);
        const fileName = path.basename(file, fileExt);
        
        console.log(`Optimizing: ${filePath}`);
        
        // Create optimized versions in different sizes
        for (const size of SIZES) {
          const image = sharp(filePath);
          const metadata = await image.metadata();
          
          // Skip if the original image is smaller than the target size
          if (metadata.width <= size) continue;
          
          // Original format optimized
          await image
            .resize(size)
            .toFile(path.join(dir, `${fileName}-${size}${fileExt}`));
          
          // Alternative formats
          for (const format of FORMATS) {
            await image
              .resize(size)
              .toFormat(format)
              .toFile(path.join(dir, `${fileName}-${size}.${format}`));
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  }
  
  console.log('Image optimization completed successfully!');
}

optimizeImages().catch(err => {
  console.error('Error during image optimization:', err);
  process.exit(1);
});