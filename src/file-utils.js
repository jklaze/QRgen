
/**
 * Processes a logo file, validating its type and size before reading it.
 * @param {File} file - The file object to process.
 * @param {number} maxSize - Maximum allowed file size in bytes (default 2MB).
 * @returns {Promise<string|null>} A promise that resolves with the file's data URL or null.
 */
export function processLogoFile(file, maxSize = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected.'));
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type. Please upload an image.'));
    }

    if (file.size > maxSize) {
      return reject(new Error(`File is too large. Maximum size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB.`));
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result ?? null);
    reader.onerror = () => reject(new Error('Error reading file.'));
    reader.readAsDataURL(file);
  });
}
