import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Farmhouse linen from the app palette. Matches the paper the seal is painted on
// (the source file's own paper is #EBE2D1, one step away — invisible at icon size).
const BG = { r: 234, g: 225, b: 208 }; // #EAE1D0 --color-farmhouse-linen

// "any" icons: the artwork's width is this fraction of the square, so the seal
// sits centered with comfortable padding. iOS rounds the corners itself.
const ANY_ARTWORK_FRACTION = 0.74;

// Maskable safe zone is a centered circle with diameter 80% (radius 0.4).
// Keep the seal's ink inside a slightly smaller circle so the ring is not clipped.
const MASKABLE_INK_RADIUS_FRACTION = 0.34;
const MASKABLE_SAFE_RADIUS_FRACTION = 0.4;

const splashScreens = [
  { width: 2048, height: 2732, name: 'apple-splash-2048-2732' },
  { width: 1668, height: 2388, name: 'apple-splash-1668-2388' },
  { width: 1536, height: 2048, name: 'apple-splash-1536-2048' },
  { width: 1290, height: 2796, name: 'apple-splash-1290-2796' },
  { width: 1179, height: 2556, name: 'apple-splash-1179-2556' },
];

const outputDir = join(__dirname, '../public/assets');
const logoPath = join(outputDir, 'logo.png');

function isInk(r, g, b) {
  return Math.abs(r - BG.r) + Math.abs(g - BG.g) + Math.abs(b - BG.b) > 40;
}

async function measureLogo() {
  const { data, info } = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  let maxR = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (isInk(data[i], data[i + 1], data[i + 2])) {
        const radius = Math.hypot(x - cx, y - cy);
        if (radius > maxR) maxR = radius;
      }
    }
  }
  if (maxR <= 0) throw new Error('Could not find the Academy mark in logo.png');
  return { width, height, maxR };
}

async function renderSquare(size, artworkWidth) {
  const resized = await sharp(logoPath)
    .resize({ width: artworkWidth, height: artworkWidth, fit: 'inside' })
    .png()
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: BG,
    },
  })
    .composite([{ input: resized, left, top }])
    .flatten({ background: BG })
    .removeAlpha()
    .png();
}

async function generateIcons() {
  const logo = await measureLogo();
  const anyWidth = (size) => Math.round(size * ANY_ARTWORK_FRACTION);
  const maskableWidth = (size) => Math.max(
    1,
    Math.round((MASKABLE_INK_RADIUS_FRACTION * size) / logo.maxR * logo.width),
  );

  const icons = [
    { size: 180, name: 'apple-touch-icon.png', artworkWidth: anyWidth(180) },
    { size: 192, name: 'icon-192.png', artworkWidth: anyWidth(192) },
    { size: 512, name: 'icon-512.png', artworkWidth: anyWidth(512) },
    { size: 512, name: 'icon-maskable-512.png', artworkWidth: maskableWidth(512), maskable: true },
    { size: 32, name: 'favicon.png', artworkWidth: anyWidth(32) },
  ];

  for (const icon of icons) {
    const file = join(outputDir, icon.name);
    await (await renderSquare(icon.size, icon.artworkWidth)).toFile(file);
    await assertIcon(file, icon.size, { maskable: Boolean(icon.maskable) });
    console.log(`wrote ${icon.name} ${icon.size}x${icon.size} artwork ${icon.artworkWidth}px`);
  }
}

async function assertIcon(file, size, { maskable }) {
  const meta = await sharp(file).metadata();
  if (meta.width !== size || meta.height !== size) {
    throw new Error(`${file} is ${meta.width}x${meta.height}, expected ${size}x${size}`);
  }
  if (meta.hasAlpha) {
    throw new Error(`${file} still has an alpha channel`);
  }

  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 3) {
    throw new Error(`${file} has ${channels} channels, expected opaque RGB`);
  }

  const pixel = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const matchesBg = (p) => p[0] === BG.r && p[1] === BG.g && p[2] === BG.b;

  const inset = Math.min(2, size - 1);
  const samples = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [inset, inset],
    [width - 1 - inset, inset],
    [inset, height - 1 - inset],
    [width - 1 - inset, height - 1 - inset],
  ];
  for (const [x, y] of samples) {
    const p = pixel(x, y);
    if (!matchesBg(p)) {
      throw new Error(`${file} corner ${x},${y} is ${p.join(',')} — expected opaque ${BG.r},${BG.g},${BG.b}`);
    }
  }

  if (maskable) {
    const cx = (width - 1) / 2;
    const cy = (height - 1) / 2;
    const safeR = width * MASKABLE_SAFE_RADIUS_FRACTION;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = pixel(x, y);
        const delta = Math.abs(p[0] - BG.r) + Math.abs(p[1] - BG.g) + Math.abs(p[2] - BG.b);
        if (delta > 40 && Math.hypot(x - cx, y - cy) > safeR + 0.5) {
          throw new Error(`${file} mark pixel at ${x},${y} is outside the 80% maskable safe zone`);
        }
      }
    }
  }
}

async function generateSplash() {
  const inputImage = join(outputDir, 'logo-circle-crop.png');
  const splashDir = join(outputDir, 'splash');
  await fs.mkdir(splashDir, { recursive: true });

  for (const screen of splashScreens) {
    await sharp(inputImage)
      .resize(screen.width, screen.height, {
        fit: 'contain',
        background: { r: 245, g: 241, b: 234 }, // bg-farmhouse-cream
      })
      .toFile(join(splashDir, `${screen.name}.png`));
  }
}

const only = process.argv[2];
const run = async () => {
  if (!only || only === 'icons') await generateIcons();
  if (!only || only === 'splash') await generateSplash();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
