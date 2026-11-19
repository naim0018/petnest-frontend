const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7b7b"/>
      <stop offset="100%" stop-color="#ff5757"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#coralGrad)"/>
  <g transform="translate(106, 106) scale(15)">
    <path
      d="M10.99365 2c0 1.10457-0.89543 2-2 2-1.10457 0-2-0.89543-2-2 0-1.10457 0.89543-2 2-2 1.10457 0 2 0.89543 2 2z m5 6c1.10457 0 2-0.89543 2-2m-4 0c0 1.10457 0.89543 2 2 2m0-4c-1.10457 0-2 0.89543-2 2m4 0c0-1.10457-0.89543-2-2-2m2 12c1.10457 0 2-0.89543 2-2m-4 0c0 1.10457 0.89543 2 2 2m0-4c-1.10457 0-2 0.89543-2 2m4 0c0-1.10457-0.89543-2-2-2m-9.08634-3.6194c-0.60663-0.25127-1.25681-0.3806-1.91342-0.3806m3.53553 1.46447c-0.46429-0.46429-1.01549-0.83259-1.62211-1.08387m2.70598 2.70598c-0.25127-0.60663-0.61957-1.15782-1.08387-1.62211m1.46447 3.53553c0-0.65661-0.12933-1.30679-0.3806-1.91342m0.3806 5.41342l0-3.5m-0.84518 5.77964c0.54508-0.63447 0.84491-1.44318 0.84518-2.27964m-2.97141 3.45872c0.82687-0.12633 1.58115-0.54461 2.12623-1.17908m-4.50753 0.68865c0.70966 0.44278 1.55443 0.61676 2.3813 0.49043m-3.86859-2.41372c0.25001 0.79822 0.77763 1.48051 1.48729 1.92329m-4.18729-4.62829c1.37333 0.42667 2.27333 1.32833 2.7 2.705m-4.62264-4.19123c0.44281 0.70914 1.12482 1.23635 1.92264 1.48623m-2.41411-3.86612c-0.12567 0.82653 0.04867 1.67075 0.49147 2.37989m0.68515-4.50615c-0.63357 0.54548-1.05095 1.29973-1.17662 2.12626m3.45411-2.97388c-0.83603 0.00146-1.64393 0.30214-2.27749 0.84762m5.77749-0.84762l-3.5 0"
      fill="none"
      stroke="#ffffff"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  const appDir = path.resolve(__dirname, '../src/app');

  const svgBuffer = Buffer.from(svgContent);

  // Save the SVG icon
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgBuffer);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgBuffer);

  // Sizes to generate
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'icon.png', size: 512 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'basekitfavicon.png', size: 512 }, // overwrite old basekit icon
  ];

  for (const item of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, item.name), pngBuffer);
    console.log(`Generated public/${item.name} (${item.size}x${item.size})`);

    // Next.js App directory icons
    if (['icon.png', 'apple-icon.png'].includes(item.name)) {
      fs.writeFileSync(path.join(appDir, item.name), pngBuffer);
      console.log(`Generated src/app/${item.name}`);
    }
  }

  // Create a proper multi-size ICO file containing 16x16, 32x32, 48x48
  const b16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const b32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const b48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: b16 },
    { size: 32, buffer: b32 },
    { size: 48, buffer: b48 },
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico and src/app/favicon.ico');
}

// Minimal standard ICO binary packer for PNG frames
function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * count;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type (1 = icon)
  header.writeUInt16LE(count, 4); // number of images

  const entries = [];
  const buffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image byte size
    entry.writeUInt32LE(offset, 12); // image offset

    entries.push(entry);
    buffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...buffers]);
}

main().catch(console.error);
