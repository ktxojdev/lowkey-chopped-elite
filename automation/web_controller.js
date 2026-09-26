const { chromium } = require('./node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function runBrowserTask({ url, actions = [], headless = true, screenshot = 'page.png' }) {
  console.log(`[WebController] Launching Chromium (headless: ${headless})...`);
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  if (url) {
    console.log(`[WebController] Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  for (const step of actions) {
    if (step.action === 'click') {
      console.log(`[WebController] Clicking: ${step.selector}`);
      await page.waitForSelector(step.selector, { timeout: 10000 });
      await page.click(step.selector);
    } else if (step.action === 'type') {
      console.log(`[WebController] Typing into: ${step.selector}`);
      await page.waitForSelector(step.selector, { timeout: 10000 });
      await page.fill(step.selector, step.text);
    } else if (step.action === 'press') {
      console.log(`[WebController] Pressing key: ${step.key}`);
      await page.keyboard.press(step.key);
    } else if (step.action === 'wait') {
      console.log(`[WebController] Waiting ${step.ms}ms...`);
      await page.waitForTimeout(step.ms);
    }
  }

  if (screenshot) {
    const outPath = path.resolve(__dirname, screenshot);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`[WebController] Screenshot saved to: ${outPath}`);
  }

  const title = await page.title();
  console.log(`[WebController] Page title: "${title}"`);

  await browser.close();
  return { title };
}

// CLI argument execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetUrl = args[0] || 'https://example.com';
  const outFile = args[1] || 'screenshot.png';

  runBrowserTask({
    url: targetUrl,
    screenshot: outFile,
    headless: true
  }).then(() => {
    console.log('[WebController] Completed successfully.');
  }).catch((err) => {
    console.error('[WebController] Error:', err.message);
    process.exit(1);
  });
}

module.exports = { runBrowserTask };
