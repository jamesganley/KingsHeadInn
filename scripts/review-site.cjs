const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || undefined,headless:true});
  const out = process.env.REVIEW_OUTPUT || path.join(__dirname,'..','.tmp','site-review');
  fs.mkdirSync(out,{recursive:true});
  const errors = [];
  for (const width of [1440,390,320]) {
    const context = await browser.newContext({viewport:{width,height:960}});
    const page = await context.newPage();
    page.on('pageerror', e=>errors.push(e.message));
    await page.route('**/api/v1/json/**', route=>route.fulfill({json:{events:null}}));
    for (const file of ['food.html','rooms.html','live-sport.html','events.html']) {
      await page.goto('http://127.0.0.1:8765/'+file);
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(200);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('.site-nav a').count(),4);
      assert.equal(await page.locator('.site-nav [aria-current="page"]').count(),1);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      assert.equal(overflow,false,`${file} overflows at ${width}`);
      await page.locator('img').evaluateAll(imgs=>{imgs.forEach(i=>i.loading='eager');});
      await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
      await page.evaluate(()=>Promise.all(Array.from(document.images).map(i=>i.decode())));
      for (const img of await page.locator('img').all()) { await img.scrollIntoViewIfNeeded(); }
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await page.waitForTimeout(200);
      const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src));
      assert.deepEqual(broken,[],`${file} has missing images`);
      if(width!==320) await page.screenshot({path:path.join(out,`${file}-${width}.png`),fullPage:true});
      if(width<760) {await page.getByRole('button',{name:'Menu'}).click();await page.getByRole('navigation',{name:'Main navigation'}).waitFor({state:'visible'});await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
    }
    await page.goto('http://127.0.0.1:8765/food.html#ales');
    for(const button of await page.locator('.ale-option').all()) {
      await button.click();assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
      assert.ok((await page.locator('#ale-name').textContent()).length);
      await page.keyboard.press('Escape');assert.equal(await button.evaluate(el=>el===document.activeElement),true);
    }
    await page.locator('.session-hen').click();await page.locator('.ale-detail-close').click();
    await page.goto('http://127.0.0.1:8765/rooms.html#stay');
    const roomPhotos = page.locator('[data-room-photo]');
    assert.equal(await roomPhotos.count(), 6);
    for (let index = 0; index < 6; index++) {
      const link = roomPhotos.nth(index);
      await link.click();
      assert.equal(await page.locator('#room-lightbox').evaluate(el=>el.open), true);
      await page.locator('#room-lightbox-image img').evaluate(img=>img.decode());
      assert.match(await page.locator('#room-lightbox-caption').textContent(), new RegExp('^' + (index + 1) + ' / 6'));
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.body.classList.contains('room-gallery-open'));
      assert.equal(await link.evaluate(el=>el===document.activeElement), true);
      assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('room-gallery-open')), false);
    }
    await roomPhotos.first().click();
    await page.keyboard.press('ArrowLeft');
    assert.match(await page.locator('#room-lightbox-caption').textContent(), /^6 \/ 6/);
    await page.getByRole('button', {name:'Next room photo'}).click();
    assert.match(await page.locator('#room-lightbox-caption').textContent(), /^1 \/ 6/);
    await page.getByRole('button', {name:'Close room photos'}).click();
    await page.locator('[name=arrival]').fill('2030-02-02');await page.locator('[name=departure]').fill('2030-02-01');await page.locator('[name=departure]').dispatchEvent('change');
    assert.equal(await page.locator('[name=departure]').evaluate(el=>el.checkValidity()),false);
    await page.locator('[name=departure]').fill('2030-02-03');await page.locator('[name=departure]').dispatchEvent('change');
    assert.equal(await page.locator('[name=departure]').evaluate(el=>el.checkValidity()),true);
    await context.close();
  }
  const ctx=await browser.newContext();const p=await ctx.newPage();
  await p.route('**/api/v1/json/**',route=>{
    const id=new URL(route.request().url()).searchParams.get('id');
    if(id==='4414')return route.abort();
    const sport=id==='4370'?'Motorsport':'Football';
    return route.fulfill({json:{events:[{strEvent:sport+' fixture',strLeague:'Sample competition',strTimestamp:'2030-06-02T14:00:00',strStatus:'NS'}]}});
  });
  await p.goto('http://127.0.0.1:8765/live-sport.html');await p.waitForSelector('.sports-fixture');
  assert.equal(await p.locator('.sports-fixture').count(),3);
  assert.equal(await p.locator('.sports-fixture-date strong').first().textContent(),'15:00');
  await p.getByRole('button',{name:'Rugby',exact:true}).click();assert.match(await p.locator('#sports-schedule-list').textContent(),/No upcoming rugby/);
  await p.getByRole('button',{name:'Football',exact:true}).click();assert.equal(await p.locator('.sports-fixture').count(),2);
  for(const [old,dest]of [['index.html','food.html'],['reservation.html','rooms.html'],['ales.html','food.html#ales']]){await p.goto('http://127.0.0.1:8765/'+old);await p.waitForURL('**/'+dest);}
  assert.deepEqual(errors,[]);await browser.close();
  console.log('PASS: four pages at 1440/390/320px; navigation; images; ten ale dialogs; date validation; partial feed failure; UK summer time; sports filters; legacy redirects.');
})().catch(e=>{console.error(e);process.exit(1)});
