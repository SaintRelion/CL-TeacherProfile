const formatFolderName = (folderName: string): string => {
  if (!folderName) return "";

  const trimmed = folderName.trim();

  // Extract only letters to check if all are uppercase
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, "");

  // If there are no letters, return trimmed as-is
  if (!lettersOnly) return trimmed;

  // If ALL letters are uppercase → keep unchanged
  if (lettersOnly === lettersOnly.toUpperCase()) {
    return trimmed;
  }

  // Split into words
  const words = trimmed.split(/\s+/);

  // Apply Title Case to ALL words (including single word)
  return words
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

export default formatFolderName;