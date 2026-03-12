import { supabase } from './supabase';

/**
 * Compresses an image file using HTML5 Canvas.
 */
export const compressImage = (file: File, maxWidth = 1000, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob conversion failed'));
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 */
export const uploadImage = async (file: File | Blob, bucket: string, path: string): Promise<string> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const fullPath = `${path}/${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(fullPath, file);
    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fullPath);
    return data.publicUrl;
};
