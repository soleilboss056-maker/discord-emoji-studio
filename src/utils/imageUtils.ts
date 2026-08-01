/**
 * Utility to convert SVG Data URLs (or image URLs) to PNG Data URLs using HTML Canvas.
 * Discord API rejects data:image/svg+xml for emojis, so we convert to data:image/png;base64.
 */
export function convertSvgToPngDataUrl(
  imageUrl: string,
  width: number = 128,
  height: number = 128
): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl) {
      return resolve('');
    }

    // If it's already a PNG, GIF, JPEG, or standard HTTP URL, return as-is
    if (
      imageUrl.startsWith('data:image/png') ||
      imageUrl.startsWith('data:image/gif') ||
      imageUrl.startsWith('data:image/jpeg') ||
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {
      return resolve(imageUrl);
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(imageUrl);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const pngDataUrl = canvas.toDataURL('image/png');
          resolve(pngDataUrl);
        } catch {
          resolve(imageUrl);
        }
      };

      img.onerror = () => {
        resolve(imageUrl);
      };

      img.src = imageUrl;
    } catch {
      resolve(imageUrl);
    }
  });
}
