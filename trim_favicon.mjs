import { Jimp } from 'jimp';

async function trimImage() {
  try {
    const image = await Jimp.read('public/favicon-logo.png');
    // Autocrop trims transparent borders automatically
    image.autocrop();
    await image.write('public/favicon-logo.png');
    console.log('Successfully cropped the favicon.');
  } catch (err) {
    console.error('Error cropping image:', err);
  }
}

trimImage();
