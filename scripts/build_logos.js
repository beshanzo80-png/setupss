import fs from 'fs';
import sharp from 'sharp';

// 1. Icon SVG (Lightning S)
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" width="512" height="512" fill="none">
  <!-- Yellow 'S' path -->
  <path d="M 195 72 C 195 44 165 24 122 24 C 76 24 45 48 45 82 C 45 132 188 112 188 172 C 188 212 152 236 102 236 C 54 236 25 208 22 172" 
        stroke="#FACC15" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Lightning bolt overlay -->
  <polygon points="142,12 48,132 108,132 28,248 162,116 102,116" 
           fill="#FACC15" stroke="#EAB308" stroke-width="2" stroke-linejoin="round"/>
</svg>
`;

// 2. Full Logo SVG (Lightning S + "etupss") - Light mode (dark text)
const logoLightSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 260" width="1200" height="339" fill="none">
  <g transform="translate(10, 0)">
    <!-- Yellow 'S' path -->
    <path d="M 195 72 C 195 44 165 24 122 24 C 76 24 45 48 45 82 C 45 132 188 112 188 172 C 188 212 152 236 102 236 C 54 236 25 208 22 172" 
          stroke="#FACC15" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Lightning bolt -->
    <polygon points="142,12 48,132 108,132 28,248 162,116 102,116" 
             fill="#FACC15" stroke="#EAB308" stroke-width="2" stroke-linejoin="round"/>
  </g>
  <!-- Text 'etupss' -->
  <text x="235" y="196" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="182" fill="#0F172A" letter-spacing="-5">etupss</text>
</svg>
`;

// 3. Full Logo SVG - Dark mode (white text)
const logoDarkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 260" width="1200" height="339" fill="none">
  <g transform="translate(10, 0)">
    <!-- Yellow 'S' path -->
    <path d="M 195 72 C 195 44 165 24 122 24 C 76 24 45 48 45 82 C 45 132 188 112 188 172 C 188 212 152 236 102 236 C 54 236 25 208 22 172" 
          stroke="#FACC15" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Lightning bolt -->
    <polygon points="142,12 48,132 108,132 28,248 162,116 102,116" 
             fill="#FACC15" stroke="#EAB308" stroke-width="2" stroke-linejoin="round"/>
  </g>
  <!-- Text 'etupss' -->
  <text x="235" y="196" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="182" fill="#F8FAFC" letter-spacing="-5">etupss</text>
</svg>
`;

async function build() {
  fs.writeFileSync('public/setupss_icon.svg', iconSvg.trim());
  fs.writeFileSync('public/setupss_logo.svg', logoLightSvg.trim());
  fs.writeFileSync('public/setupss_logo_dark.svg', logoDarkSvg.trim());

  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile('public/icon.png');

  await sharp(Buffer.from(logoLightSvg))
    .png()
    .toFile('public/logoarkaplansiz.png');

  console.log(' Successfully generated icon.png and logoarkaplansiz.png with sharp!');
}

build().catch(console.error);
