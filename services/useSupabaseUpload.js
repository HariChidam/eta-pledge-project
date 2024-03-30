import supabase from '../utils/supabase'; // Adjust the path as necessary
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file) {
  const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
  const filePath = `images/${fileName}`;

  const { error } = await supabase.storage.from('your-bucket-name').upload(filePath, file);
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return fileName;
}
