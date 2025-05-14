import { FileData } from '@/interfaces/file.interface';

const fileReader = (
  uploadedFiles: FileList | null,
  addError: (error: string) => void,
  allowedFileTypes: string[]
) => {
  const files: FileData[] = [];

  if (!uploadedFiles) {
    addError('Tiedostoja ei valittu.');
    return files;
  }

  for (const currentFile of uploadedFiles) {
    if (allowedFileTypes.includes(currentFile.type)) {
      files.push({
        data: currentFile,
        type: currentFile.type,
        fileName: currentFile.name,
      });
    } else {
      addError('Väärä tiedostotyyppi.');
    }
  }

  return files;
};

export default fileReader;
