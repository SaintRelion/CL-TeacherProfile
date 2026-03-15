/**
 * Converts a folder name to Title Case (capitalize first letter of each word)
 * Only applied if there are 2 or more words.
 * Single words are returned unchanged.
 * 
 * Exception: If the input is entirely in ALL CAPS (ignoring spaces, numbers, underscores, hyphens),
 * it is returned unchanged.
 * 
 * @param folderName - The input folder name string
 * @returns The formatted folder name
 * 
 * @example
 * formatFolderName("personal data sheets") // => "Personal Data Sheets"
 * formatFolderName("PDF") // => "PDF" (single word, unchanged)
 * formatFolderName("PDS_DOCUMENTS") // => "PDS_DOCUMENTS" (all caps, unchanged)
 * formatFolderName("hello world") // => "Hello World"
 * formatFolderName("pds") // => "pds" (single word, unchanged)
 */
const formatFolderName = (folderName: string): string => {
  if (!folderName) return "";

  const trimmed = folderName.trim();

  // Extract only letters to check if all are uppercase
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");

  // If there are no letters, return trimmed as-is
  if (!lettersOnly) return trimmed;

  // Check if all letters are uppercase
  if (lettersOnly === lettersOnly.toUpperCase()) {
    return trimmed;
  }

  // Split by spaces to count words
  const words = trimmed.split(/\s+/);

  // If single word, return as-is
  if (words.length === 1) {
    return trimmed;
  }

  // If 2 or more words, apply Title Case
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default formatFolderName;
