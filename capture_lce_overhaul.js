const puppeteer = require('puppeteer-core');
const path = require('path');

const targetDir = "C:/Users/Omar Murad/.gemini/antigravity/brain/f3db2d99-ee09-46ac-a03f-0d22892e05a5";
const BASE_URL = "https://lce-turg-app.vercel.app";

async function run() {
  console.log(`Launching Puppeteer against ${BASE_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // 1. Home Page
    console.log('1. Capturing Home Page...');
    let page = await browser.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_home.png') });

    // 2. Command Palette (Ctrl+K)
    console.log('2. Triggering Command Palette...');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Control');
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_command_palette.png') });
    await page.close();

    // 3. Activities Page & Hover
    console.log('3. Capturing Activities Page...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/games`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    // Hover over the first card
    const firstCard = await page.$('.grid > div:first-child');
    if (firstCard) {
      await firstCard.hover();
      await new Promise(r => setTimeout(r, 600));
    }
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_activities.png') });

    // 4. Click Activity to open full-window top bar player
    console.log('4. Launching Activity Player...');
    if (firstCard) {
      await firstCard.click();
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_activity_player.png') });
    }
    await page.close();

    // 5. Movies & TV Page & Details Modal with Actors
    console.log('5. Capturing Movies & TV Page & Details Modal...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/entertainment/movies`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    // Click on the second movie card
    const movieCard = await page.$('.grid > div:nth-child(2)');
    if (movieCard) {
      await movieCard.click();
      await new Promise(r => setTimeout(r, 2500)); // wait for actors and details to load from TMDB
      await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_movie_modal.png') });

      // Click "Watch Now" to test stream player
      console.log('6. Testing Watch Stream...');
      const watchBtn = await page.$('button ::-p-text(Watch Now)');
      if (watchBtn) {
        await watchBtn.click();
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_stream_player.png') });
      }
    }
    await page.close();

    // 7. Live TV Page
    console.log('7. Capturing Live TV (25+ channels)...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/entertainment/live`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_livetv.png') });
    await page.close();

    // 8. ChoppedAI Page
    console.log('8. Capturing ChoppedAI Studio...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/ai`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_chopped_ai.png') });
    await page.close();

    // 9. Soundboard with MyInstants
    console.log('9. Capturing Soundboard (MyInstants)...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/soundboard`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_soundboard.png') });
    await page.close();

    // 10. WebAssembly Cloud VM
    console.log('10. Capturing Cloud VM Page...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/vm`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_vm.png') });
    await page.close();

    // 11. Settings Page
    console.log('11. Capturing Settings Page...');
    page = await browser.newPage();
    await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_v2_settings.png') });
    await page.close();

    console.log('🎉 All 11 screenshots successfully captured!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
