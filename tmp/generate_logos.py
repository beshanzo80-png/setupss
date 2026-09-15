import os
import subprocess

# 1. Icon SVG (The Lightning S)
icon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="512" height="512" fill="none">
  <g id="lightning-s">
    <!-- Base 'S' Shape -->
    <path d="M 175 68 C 175 42 148 26 112 26 C 72 26 44 46 44 76 C 44 122 170 102 170 156 C 170 192 138 212 96 212 C 54 212 28 186 26 156" 
          stroke="#FACC15" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Lightning Bolt Overlay -->
    <path d="M 125 10 L 40 118 L 92 118 L 22 226 L 140 104 L 88 104 Z" 
          fill="#FACC15" stroke="#EAB308" stroke-width="3" stroke-linejoin="round"/>
  </g>
</svg>'''

# 2. Full Logo SVG (Lightning S + "etupss")
logo_svg_light = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 260" width="1200" height="367" fill="none">
  <!-- Icon Group -->
  <g transform="translate(15, 10)">
    <!-- Base 'S' Shape -->
    <path d="M 175 68 C 175 42 148 26 112 26 C 72 26 44 46 44 76 C 44 122 170 102 170 156 C 170 192 138 212 96 212 C 54 212 28 186 26 156" 
          stroke="#FACC15" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Lightning Bolt -->
    <path d="M 125 10 L 40 118 L 92 118 L 22 226 L 140 104 L 88 104 Z" 
          fill="#FACC15" stroke="#EAB308" stroke-width="3" stroke-linejoin="round"/>
  </g>
  <!-- Text 'etupss' -->
  <text x="215" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="168" fill="#0F172A" letter-spacing="-4">etupss</text>
</svg>'''

logo_svg_dark = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 260" width="1200" height="367" fill="none">
  <!-- Icon Group -->
  <g transform="translate(15, 10)">
    <!-- Base 'S' Shape -->
    <path d="M 175 68 C 175 42 148 26 112 26 C 72 26 44 46 44 76 C 44 122 170 102 170 156 C 170 192 138 212 96 212 C 54 212 28 186 26 156" 
          stroke="#FACC15" stroke-width="42" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Lightning Bolt -->
    <path d="M 125 10 L 40 118 L 92 118 L 22 226 L 140 104 L 88 104 Z" 
          fill="#FACC15" stroke="#EAB308" stroke-width="3" stroke-linejoin="round"/>
  </g>
  <!-- Text 'etupss' -->
  <text x="215" y="182" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="168" fill="#F8FAFC" letter-spacing="-4">etupss</text>
</svg>'''

with open('public/setupss_icon.svg', 'w') as f:
    f.write(icon_svg)

with open('public/setupss_logo.svg', 'w') as f:
    f.write(logo_svg_light)

with open('public/setupss_logo_dark.svg', 'w') as f:
    f.write(logo_svg_dark)

print("Saved SVGs successfully")
