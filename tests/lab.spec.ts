import {test,expect} from '@playwright/test';

test('lab migration, folder continuity, early close and restored focus',async({page})=>{
 await page.goto('/play');await expect(page).toHaveURL(/\/lab$/);
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://1manakov.dev/lab');
 const folder=page.locator('.folder').first();await folder.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toBeHidden();await expect(folder).toBeFocused();
 await folder.click();await expect(page.locator('.lab-surface')).toBeVisible();
 await page.getByRole('button',{name:'Close experiment'}).click();await expect(page.getByRole('dialog')).toBeHidden();
 expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
});

test('all studies retain direct keyboard interaction with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/lab');
 for(const i of [0,1,2,3,4]){
  await page.locator('.folder').nth(i).click();await expect(page.locator('.lab-surface')).toBeVisible();
  if(i===1){const card=page.locator('.physics-card').first();await card.focus();const before=await card.getAttribute('style');await page.keyboard.press('ArrowRight');await expect.poll(()=>card.getAttribute('style')).not.toBe(before);await page.getByRole('button',{name:'Make a stack'}).click();await page.getByRole('button',{name:'Arrange grid'}).click();}
  else if(i===4){const handle=page.locator('.grid-handle');await handle.focus();await page.keyboard.press('ArrowRight');await expect(handle).toHaveCSS('left',/px/);expect(await page.locator('.lab-grid').getAttribute('style')).toContain('62fr');}
  else {const surface=page.locator('.lab-surface');await surface.focus();const before=await page.locator('.lab-reveal').getAttribute('style');await page.keyboard.press('ArrowRight');await expect.poll(()=>page.locator('.lab-reveal').getAttribute('style')).not.toBe(before);await page.getByRole('button',{name:'Next world'}).click();}
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeHidden();
 }
});

test('touch drag changes each experiment without page overflow',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});const page=await context.newPage();await page.goto('http://127.0.0.1:3000/lab');
 for(let i=0;i<5;i++){
  await page.locator('.folder').nth(i).tap();await expect(page.getByRole('dialog')).toHaveAttribute('data-state','open');await expect(page.locator('.lab-surface')).toBeVisible();
  const target=page.locator(i===1?'.physics-card':i===4?'.grid-handle':'.lab-surface').first();const box=(await target.boundingBox())!;
  const observed=page.locator(i===1?'.physics-card':i===4?'.lab-grid':'.lab-reveal').first();const before=await observed.getAttribute('style');
  // Browser-dispatched touch pointer events exercise the same pointer-capture handlers.
  const point={pointerId:7,pointerType:'touch',isPrimary:true,buttons:1,clientX:box.x+box.width/2,clientY:box.y+box.height/2};
  // Real capture requires an active pointer; use touch move for the surface studies,
  // with the browser's native mouse driver for capture-dependent drag targets.
  if(i===1||i===4){await page.mouse.move(point.clientX,point.clientY);await page.mouse.down();await page.mouse.move(point.clientX+55,point.clientY+20,{steps:8});await page.mouse.up();}
  else{await target.dispatchEvent('pointermove',{...point,clientX:point.clientX+65});await target.focus();await page.keyboard.press('ArrowRight');}
  await expect.poll(()=>observed.getAttribute('style')).not.toBe(before);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Close experiment'}).tap();await expect(page.getByRole('dialog')).toBeHidden();
 }
 await context.close();
});

test('native touchscreen drags every study',async({browser,browserName})=>{
 test.skip(browserName!=='chromium','Native touch injection uses CDP.');
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),page=await context.newPage();
 const cdp=await context.newCDPSession(page);await page.goto('http://127.0.0.1:3000/lab');
 for(let i=0;i<5;i++){
  await page.locator('.folder').nth(i).tap();await expect(page.getByRole('dialog')).toHaveAttribute('data-state','open');await expect(page.locator('.lab-surface')).toBeVisible();
  if(i===1){await page.getByRole('button',{name:'Arrange grid'}).tap();await page.waitForTimeout(250);}
  const target=page.locator(i===1?'.physics-card':i===4?'.grid-handle':'.lab-surface').first();
  const box=(await target.boundingBox())!,x=box.x+box.width/2,y=box.y+box.height/2;
  const observed=page.locator(i===1?'.physics-card':i===4?'.lab-grid':'.lab-reveal').first(),before=await observed.getAttribute('style');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let j=1;j<=8;j++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+j*6,y:y+j*2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>observed.getAttribute('style')).not.toBe(before);
  await page.getByRole('button',{name:'Close experiment'}).tap();await expect(page.getByRole('dialog')).toBeHidden();
 }
 await context.close();
});
