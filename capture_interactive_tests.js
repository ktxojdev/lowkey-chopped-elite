const puppeteer = require('puppeteer-core');
const path = require('path');

const targetDir = "C:/Users/Omar Murad/.gemini/antigravity/brain/f3db2d99-ee09-46ac-a03f-0d22892e05a5";

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Capture Anime Page
  console.log('1. Capturing Anime Page...');
  let page = await browser.newPage();
  await page.goto('http://localhost:3000/entertainment/anime', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(targetDir, 'screenshot_anime.png') });
  await page.close();

  // 2. Capture Manga Page
  console.log('2. Capturing Manga Page...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/entertainment/manga', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(targetDir, 'screenshot_manga.png') });
  await page.close();

  // 3. Capture Books Page
  console.log('3. Capturing Books Page...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/entertainment/books', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(targetDir, 'screenshot_books.png') });
  await page.close();

  // 4. Capture Live TV Page
  console.log('4. Capturing Live TV Page...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/entertainment/live', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(targetDir, 'screenshot_live.png') });
  await page.close();

  // 5. Test Game Launcher Modal
  console.log('5. Testing Game Modal Launcher...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/games', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  // Click on the second game card (e.g. OvO)
  const gameCard = await page.$('.grid > div:nth-child(2)');
  if (gameCard) {
    await gameCard.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_test_game_playing.png') });
    console.log('✓ Captured Game Modal');
  }
  await page.close();

  // 6. Test Movie Details Modal
  console.log('6. Testing Movie Modal...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/entertainment/movies', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const movieCard = await page.$('.grid > div:first-child');
  if (movieCard) {
    await movieCard.click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(targetDir, 'screenshot_test_movie_modal.png') });
    console.log('✓ Captured Movie Modal');
  }
  await page.close();

  // 7. Test AI Active Chat
  console.log('7. Testing AI Chat Interaction...');
  page = await browser.newPage();
  await page.goto('http://localhost:3000/ai', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const inputSelector = 'input[placeholder="Ask anything..."]';
  await page.waitForSelector(inputSelector);
  await page.type(inputSelector, 'Show me what makes Lowkey Chopped Elite special.');
  await page.keyboard.press('Enter');
  // Wait for AI reply to render
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(targetDir, 'screenshot_test_ai_active_chat.png') });
  console.log('✓ Captured Active AI Chat');
  await page.close();

  await browser.close();
  console.log('All tests and interactive screenshots captured successfully!');
}

run();
