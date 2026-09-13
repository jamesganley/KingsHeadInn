const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, headless: true });
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 960 } });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:8765/rooms.html');
      const audit = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual((await audit()).violations.map(v => v.id), [], 'Rooms accessibility');
      await page.locator('[data-room-photo]').nth(1).click();
      await page.locator('#room-lightbox-image img').evaluate(img => img.decode());
      assert.deepEqual((await audit()).violations.map(v => v.id), [], 'Photo viewer accessibility');
      const fits = await page.locator('#room-lightbox').evaluate(el => el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1);
      assert.equal(fits, true, 'Photo viewer should fit without scrolling');
      await page.screenshot({ path: path.join(__dirname, '..', '.tmp', 'site-review', 'room-viewer-' + width + '.png') });
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => !!document.activeElement.closest('#room-lightbox')), true);
      await page.getByRole('button', { name: 'Previous room photo' }).click();
      assert.match(await page.locator('#room-lightbox-caption').textContent(), /^1 \/ 6/);
      await page.keyboard.press('Escape');
      await context.close();
    }
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8765/rooms.html');
    const first = page.locator('[data-room-photo]').first();
    const href = await first.getAttribute('href');
    const response = await context.request.head('http://127.0.0.1:8765/' + href);
    assert.equal(response.status(), 200);
    // Windows' MIME registry can make Python's local server download WebP.
    // Both opening the photo and downloading it preserve the no-JS fallback.
    if (response.headers()['content-type'].includes('application/octet-stream')) {
      const download = page.waitForEvent('download');
      await first.click();
      assert.equal((await download).suggestedFilename(), path.basename(href));
    } else {
      await first.click();
      await page.waitForURL('**/' + href);
      assert.ok(page.url().endsWith(href), 'Gallery works as direct image links without JavaScript');
    }
    await context.close();
    console.log('Room gallery passed: desktop/mobile viewer sizing, accessibility, controls and no-JavaScript links.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
