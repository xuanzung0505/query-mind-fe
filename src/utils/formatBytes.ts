// utils.js

/**
 * Formats bytes into a human-readable string (e.g., "1.2 MB").
 * @param {number} bytes The file size in bytes.
 * @param {number} decimals The number of decimal places (default is 2).
 * @returns {string} The formatted file size string.
 */
export default function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes"; //

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; //

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
