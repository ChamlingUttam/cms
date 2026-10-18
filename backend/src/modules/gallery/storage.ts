import { v2 as cloudinary } from 'cloudinary';
import type { GalleryStorage } from './service';
import { getImageDelivery } from './delivery';

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials are not configured.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
   console.log(
    'Cloudinary using:',
    cloudName,
    'key length:',
    apiKey.length,
    'secret length:',
    apiSecret.length,
  );

}

export const cloudinaryStorage: GalleryStorage = {
  upload(filePath, publicId) {
    configureCloudinary();

    return cloudinary.uploader
      .upload(filePath, {
        public_id: publicId,
        overwrite: false,
        unique_filename: false,
        use_filename: false,
        resource_type: 'image',
      })
      .then((result) => {
        if (
          !result.secure_url ||
          !result.public_id ||
          !result.width ||
          !result.height ||
          !result.format ||
          !result.bytes
        ) {
          throw new Error('Cloudinary returned incomplete image metadata.');
        }

        return {
          imageUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        };
      });
  },

  async delete(publicId) {
    configureCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Cloudinary did not confirm image deletion.');
    }
  },
};
