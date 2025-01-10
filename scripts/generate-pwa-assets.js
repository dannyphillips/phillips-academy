import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { width: 180, height: 180, name: 'apple-touch-icon' },
  // Add more sizes if needed
];

const splashScreens = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732' },
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048' },
  { width: 1290, height: 2796, name: 'apple-splash-1290-2796' },
  { width: 1179, height: 2556, name: 'apple-splash-1179-2556' },
];

async function generateAssets() {
  const inputImage = join(__dirname, '../public/assets/logo-circle-crop.png');
  const outputDir = join(__dirname, '../public/assets');
  const splashDir = join(outputDir, 'splash');

  // Ensure directories exist
  await fs.mkdir(splashDir, { recursive: true });

  // Generate icons
  for (const size of sizes) {
    await sharp(inputImage)
      .resize(size.width, size.height)
      .toFile(join(outputDir, `${size.name}.png`));
  }

  // Generate splash screens
  for (const screen of splashScreens) {
    await sharp(inputImage)
      .resize(screen.width, screen.height, {
        fit: 'contain',
        background: { r: 245, g: 241, b: 234 } // Your bg-farmhouse-cream color
      })
      .toFile(join(splashDir, `${screen.name}.png`));
  }
}

generateAssets().catch(console.error); 