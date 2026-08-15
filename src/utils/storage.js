import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadPhoto = async (id, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error saving photo:', error);
    return null;
  }
};

export const saveDateData = async (id, data) => {
  try {
    const { error } = await supabase
      .from('completed_dates')
      .upsert({ id: id, ...data }, { onConflict: 'id' });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving date data:', error);
  }
}

export const getAllDateData = async () => {
    try {
        const { data, error } = await supabase
            .from('completed_dates')
            .select('*');
        
        if (error) throw error;

        const dateDataMap = {};
        if (data) {
            data.forEach(row => {
                dateDataMap[row.id] = row;
            });
        }
        return dateDataMap;
    } catch (error) {
        console.error("Error getting all date data:", error);
        return {};
    }
}
