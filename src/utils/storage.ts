// ========================== src/utils/storage.ts ==========================
import { supabase } from '../api/supabase';

export async function uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  return data;
}
