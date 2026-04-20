const sharp = require('sharp');
const inputPath = 'c:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/public/images/work-law.png';
const outputBase = 'c:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/public/images/work-law';

async function convert() {
  try {
    await sharp(inputPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`${outputBase}.webp`);
    console.log('Generated WebP');

    await sharp(inputPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .avif({ quality: 65 })
      .toFile(`${outputBase}.avif`);
    console.log('Generated AVIF');
  } catch (err) {
    console.error('Error converting image:', err);
  }
}

convert();
