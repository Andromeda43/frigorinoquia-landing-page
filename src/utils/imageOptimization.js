// Utilidad para optimizar imágenes con Astro y Sharp
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

export function getImageConfig() {
  return {
    serviceEntryPoint: fileURLToPath(import.meta.url),
    logLevel: 'info',
    defaultQuality: 80,
    formats: ['avif', 'webp'],
    fallbackFormat: 'png',
  };
}

// Función de ayuda para generar srcset para imágenes responsive
export function generateSrcSet(basePath, widths = [640, 768, 1024, 1280, 1536]) {
  const baseUrl = new URL(basePath, import.meta.url);
  const extension = basePath.split('.').pop();
  const baseName = basePath.split('/').pop().replace(`.${extension}`, '');
  const baseDir = basePath.split('/').slice(0, -1).join('/');
  
  // Generar srcset para imágenes regulares
  const srcset = widths
    .map((width) => `${baseDir}/${baseName}-${width}.${extension} ${width}w`)
    .join(', ');
  
  // Generar srcset para webp
  const webpSrcset = widths
    .map((width) => `${baseDir}/${baseName}-${width}.webp ${width}w`)
    .join(', ');
  
  return {
    src: basePath,
    srcset,
    webpSrcset,
  };
}

// Función para generar atributos de imagen optimizada
export function getOptimizedImageAttrs(src, alt, className = '', sizes = '100vw', lazy = true) {
  const { srcset, webpSrcset } = generateSrcSet(src);
  
  return {
    src,
    alt,
    class: className,
    srcset,
    sizes,
    loading: lazy ? 'lazy' : 'eager',
    decoding: 'async',
    width: '100%',
    height: 'auto',
  };
}