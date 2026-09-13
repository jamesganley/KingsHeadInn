const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const base = 'http://127.0.0.1:8765/';
const root = path.resolve(__dirname, '..');
const pages = ['food.html', 'rooms.html', 'live-sport.html', 'events.html'];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/v1/json/**', route => route.fulfill({ json: { events: null } }));
    const links = new Set();
    for (const width of [1850, 1000, 700, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      for (const file of pages) {
        await page.goto(base + file);
        await page.evaluate(() => document.fonts.ready);
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        assert.deepEqual(audit.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], file + ' accessibility at ' + width);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        if (file !== 'rooms.html') {
          const fits = await page.locator('.exterior-visit').evaluate(el => {
            const box = el.getBoundingClientRect();
            const actions = el.querySelector('.actions').getBoundingClientRect();
            return actions.bottom <= box.bottom && actions.left >= box.left && actions.right <= box.right;
          });
          assert.equal(fits, true, file + ': banner controls clipped at ' + width);
        }
        if (width !== 1850) continue;
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://thekingsheadinn.pub/' + file);
        assert.match(await page.title(), /Billingshurst/);
        const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent())['@graph'];
        assert.equal(graph.find(item => item['@type'] === 'BarOrPub').address.postalCode, 'RH14 9NY');
        assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://thekingsheadinn.pub/' + file);
        for (const href of await page.locator('a[href]').evaluateAll(as => as.map(a => a.href))) {
          if (href.startsWith(base)) links.add(href);
        }
      }
    }
    for (const href of links) {
      const response = await context.request.get(href);
      assert.equal(response.ok(), true, 'Broken link: ' + href);
      const url = new URL(href);
      if (url.hash && response.headers()['content-type'].includes('text/html')) {
        await page.goto(href);
        assert.equal(await page.evaluate(id => Boolean(document.getElementById(id)), decodeURIComponent(url.hash.slice(1))), true, 'Missing anchor: ' + href);
      }
    }
    assert.match(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/thekingsheadinn.pub\/sitemap.xml/);
    for (const file of pages) assert.ok(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').includes('/' + file));

    // No real enquiry is sent. Each response is intercepted before reaching FormSubmit.
    const fillForm = async p => {
      await p.locator('[name=name]').fill('Website test');
      await p.locator('[name=email]').fill('website-test@example.com');
      await p.locator('[name=arrival]').fill('2030-06-02');
      await p.locator('[name=departure]').fill('2030-06-03');
      await p.locator('[name=message]').fill('Test preferences');
    };
    for (const outcome of ['success', 'rejected', 'missing-success', 'html', 'network', 'timeout']) {
      const ctx = await browser.newContext();
      const p = await ctx.newPage();
      let requests = 0;
      await p.route('https://formsubmit.co/**', async route => {
        requests++;
        assert.equal(route.request().method(), 'POST');
        assert.equal(route.request().postDataJSON()._replyto, 'website-test@example.com');
        if (outcome === 'network') return route.abort();
        if (outcome === 'timeout') return; // AbortController must end the pending request.
        if (outcome === 'html') return route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Error</h1>' });
        return route.fulfill({ json: outcome === 'success' ? { success: 'true' } : outcome === 'rejected' ? { success: 'false' } : {} });
      });
      await p.goto(base + 'rooms.html#stay');
      await fillForm(p);
      if (outcome === 'timeout') await p.clock.install();
      await p.locator('#send-enquiry').click();
      if (outcome === 'timeout') {
        await p.locator('#stay-form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
        await p.clock.runFor(12500);
      }
      await p.locator('#enquiry-status.is-' + (outcome === 'success' ? 'success' : 'error')).waitFor();
      assert.ok(p.url().startsWith(base + 'rooms.html'));
      assert.equal(requests, 1);
      assert.equal(await p.locator('#send-enquiry').isEnabled(), true);
      if (outcome !== 'success') {
        assert.equal(await p.locator('[name=name]').inputValue(), 'Website test');
        assert.equal(await p.locator('#enquiry-status a').count(), 2);
      }
      await ctx.close();
    }
    const local = await browser.newPage();
    await local.goto(pathToFileURL(path.join(root, 'rooms.html')).href);
    await fillForm(local);
    await local.locator('#send-enquiry').click();
    await local.locator('#enquiry-status.is-error').waitFor();
    assert.match(local.url(), /^file:/);

    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const nojsPage = await nojs.newPage();
    for (const file of pages) {
      await nojsPage.goto(base + file);
      for (const a of await nojsPage.locator('.site-nav a').all()) assert.equal(await a.isVisible(), true, file + ' no-JS navigation');
    }
    assert.deepEqual(errors, []);
    console.log('PASS: five viewport sizes; WCAG A/AA automated checks; banner controls; internal links and anchors; SEO metadata/schema; six mocked enquiry outcomes; file preview fallback; no-JavaScript mobile navigation.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
