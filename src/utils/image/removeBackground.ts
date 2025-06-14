
// AI-powered in-browser background remover using huggingface/transformers.js
import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

// Returns a Promise<HTMLImageElement> from a Blob
export const loadImage = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });

// Removes the background from the image element and returns a Blob with transparency.
export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', { device: 'webgpu' });

  // Draw the image on canvas (resize if needed)
  let width = imageElement.naturalWidth;
  let height = imageElement.naturalHeight;
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas error');
  ctx.drawImage(imageElement, 0, 0, width, height);

  const base64 = canvas.toDataURL('image/png');
  const result = await segmenter(base64);

  if (!result || !Array.isArray(result) || !result[0].mask) throw new Error('Segmentation failed');
  // Compose a transparent background using the mask:
  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const octx = outputCanvas.getContext('2d');
  if (!octx) throw new Error('Output canvas error');
  octx.drawImage(canvas, 0, 0);

  const imgData = octx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < result[0].mask.data.length; i++) {
    const alpha = Math.round((result[0].mask.data[i]) * 255); // keep the mask area only
    data[i * 4 + 3] = alpha;
  }
  octx.putImageData(imgData, 0, 0);

  return new Promise((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create final blob'))),
      'image/png',
      1.0,
    );
  });
};
