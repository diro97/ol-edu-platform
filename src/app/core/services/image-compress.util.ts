/**
 * Compresses an image File down to a small base64 JPEG data URL so it can be
 * safely stored inside a Firestore document (1 MiB per-document limit).
 * Resizes to a max dimension and reduces JPEG quality until it's under the
 * target size, or gives up after a few attempts.
 */
export function compressImageToDataUrl(
  file: File,
  maxDimension = 1000,
  targetBytes = 400_000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let attempts = 0;
        while (dataUrl.length > targetBytes * 1.37 && attempts < 6) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', Math.max(quality, 0.15));
          attempts++;
        }
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
