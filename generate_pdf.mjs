import { readFileSync } from 'fs';
import { launch } from 'puppeteer';

import cv from './cv.json' assert { type: 'json' };

// import { chromium } from 'playwright-chromium';

const destDir = 'public'  // or 'dist' if we want to generate pdf in GitHub Actions

async function generatePDF(html, outputPath) {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    path: outputPath,
  });
  await browser.close();
  console.log('generatePDF completed')
  return pdf;
}

async function generatePDFPlaywright(html, outputPath) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(html)
  await page.pdf({
    format: 'A4',
    preferCSSPageSize: true,
    path: outputPath,
  });
  await browser.close();
}

// read file dist/index.html
const html = readFileSync('dist/index.html', 'utf8');

// match title
const titleRegex = /<title>(.*)<\/title>/;
const title = html.match(titleRegex)[1];

// match semver in title
const semverRegex = /v?\d+\.\d+\.\d+/;
const semver = title.match(semverRegex)[0];
if (semver !== cv.meta.version) {
  console.warn(`Version mismatch between title (${semver}) and cv.json (${cv.meta.version})`);
  process.exit(1)
}

console.log("call generate pdf")
await generatePDF(html, `${destDir}/${title}.pdf`)
console.log("call end")
