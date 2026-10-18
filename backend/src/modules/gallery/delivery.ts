const responsiveWidths = [320, 640, 960, 1280];

function createDeliveryUrl(imageUrl: string, transformations: string) {
  const uploadPath = '/image/upload/';
  const uploadIndex = imageUrl.indexOf(uploadPath);

  if (uploadIndex === -1) {
    throw new Error('Cloudinary returned an invalid secure image URL.');
  }

  const insertAt = uploadIndex + uploadPath.length;

  return `${imageUrl.slice(0, insertAt)}${transformations}/${imageUrl.slice(insertAt)}`;
}

export function getImageDelivery(imageUrl: string) {
  return {
    imageUrl: createDeliveryUrl(imageUrl, 'f_auto,q_auto'),
    srcSet: responsiveWidths
      .map(
        (width) =>
          `${createDeliveryUrl(imageUrl, `f_auto,q_auto,w_${width},c_limit`)} ${width}w`,
      )
      .join(', '),
  };
}
