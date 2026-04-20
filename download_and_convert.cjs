const fs = require('fs');
const https = require('https');
const sharp = require('sharp');

const url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=80';
const inputPath = 'c:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/public/images/work-law.png';
const outputBase = 'c:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/public/images/work-law';

https.get(url, (res) => {
  if (res.statusCode === 302 || res.statusCode === 301) {
    https.get(res.headers.location, (response) => {
      const file = fs.createWriteStream(inputPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        processImage();
      });
    });
  } else {
    const file = fs.createWriteStream(inputPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      processImage();
    });
  }
});

async function processImage() {
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
