#!/usr/bin/env node

/**
 * inject-watermark.js
 * 
 * Injects the open-design watermark component into all HTML template files.
 * This script adds a "Made by open-design" watermark to the bottom-right corner
 * of generated artifacts, linking back to the GitHub repository.
 * 
 * Usage: node scripts/inject-watermark.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the watermark component
const watermarkPath = path.join(__dirname, '../public/watermark.html');
const watermarkContent = fs.readFileSync(watermarkPath, 'utf8');

// Find all template.html files
const templatePaths = [
  'templates/deck-framework.html',
  'skills/mobile-app/assets/template.html',
  'skills/web-prototype/assets/template.html',
  'skills/simple-deck/assets/template.html',
  'skills/guizang-ppt/assets/template.html',
];

// Also scan for any other HTML templates in skills directories
const skillsDir = path.join(__dirname, '../skills');
const scanForTemplates = (dir) => {
  const items = fs.readdirSync(dir);
  const templates = [];
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      templates.push(...scanForTemplates(fullPath));
    } else if (item.endsWith('.html')) {
      const relativePath = path.relative(path.join(__dirname, '..'), fullPath);
      if (!templatePaths.includes(relativePath)) {
        templates.push(relativePath);
      }
    }
  }
  
  return templates;
};

const additionalTemplates = scanForTemplates(skillsDir);
const allTemplates = [...new Set([...templatePaths, ...additionalTemplates])];

console.log('🔍 Found templates:');
allTemplates.forEach(t => console.log(`   ${t}`));
console.log('');

let injectedCount = 0;
let skippedCount = 0;

for (const templateRelPath of allTemplates) {
  const templatePath = path.join(__dirname, '..', templateRelPath);
  
  // Check if file exists
  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Skipped (not found): ${templateRelPath}`);
    skippedCount++;
    continue;
  }
  
  let content = fs.readFileSync(templatePath, 'utf8');
  
  // Check if watermark is already present
  if (content.includes('od-watermark')) {
    console.log(`⏭️  Skipped (already has watermark): ${templateRelPath}`);
    skippedCount++;
    continue;
  }
  
  // Inject watermark before closing </body> tag
  if (content.includes('</body>')) {
    content = content.replace('</body>', `${watermarkContent}\n</body>`);
    fs.writeFileSync(templatePath, content, 'utf8');
    console.log(`✅ Injected watermark: ${templateRelPath}`);
    injectedCount++;
  } else {
    console.log(`⚠️  Skipped (no </body> tag): ${templateRelPath}`);
    skippedCount++;
  }
}

console.log('');
console.log(`✨ Done! Injected watermark into ${injectedCount} template(s).`);
if (skippedCount > 0) {
  console.log(`   Skipped ${skippedCount} file(s).`);
}
