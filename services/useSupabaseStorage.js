// src/hooks/useSupabaseStorage.js or src/services/supabaseService.js
import supabase from '../utils/supabase'; // Adjust the path as necessary

export async function storeImageData(fileName, otherMetaData) {
  const { data, error } = await supabase.from('images').insert([{ file_name: fileName, ...otherMetaData }]);
  if (error) {
    console.error('Error storing image data:', error);
    return null;
  }
  return data;
}

export async function fetchImageURL(fileName) {
  const { publicURL, error } = supabase.storage.from('your-bucket-name').getPublicUrl(`images/${fileName}`);
  if (error) {
    console.error('Error fetching image URL:', error);
    return null;
  }
  return publicURL;
}
