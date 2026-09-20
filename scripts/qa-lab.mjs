import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('qa/lab',{recursive:true});const browser=await chromium.launch();const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const [w,h]of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[430,932],[390,844],[375,812]]){
 await page.setViewportSize({width:w,height:h});await page.goto('http://127.0.0.1:3000/lab');await page.locator('.folder').first().waitFor();
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+w);
 if([1440,1366,390].includes(w))await page.screenshot({path:`qa/lab/overview-${w}.png`,fullPage:true});
 for(let i=0;i<5;i++){
  await page.locator('.folder').nth(i).click();await page.locator('.lab-surface').waitFor();await page.waitForTimeout(800);
  const surface=page.locator('.lab-surface'),box=await surface.boundingBox();if(!box||box.y+box.height>h)throw Error('Clipped '+w+' '+i);
  await page.mouse.move(box.x+box.width*.4,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.55,{steps:12});await page.mouse.up();
  if(i===1){await page.getByRole('button',{name:'Make a stack'}).click();await page.waitForTimeout(350);await page.getByRole('button',{name:'Arrange grid'}).click();}
  if(i===4){await page.getByRole('button',{name:/Resize grid/}).focus();await page.keyboard.press('ArrowRight');}
  if([1440,1366,390].includes(w))await page.screenshot({path:`qa/lab/experiment-${i}-${w}.png`});
  await page.keyboard.press('Escape');await page.waitForTimeout(650);if(await page.locator('dialog').isVisible())throw Error('Close failed');
 }
}
await page.goto('http://127.0.0.1:3000/play');if(!page.url().endsWith('/lab'))throw Error('Redirect failed');
await browser.close();await fs.writeFile('qa/lab/result.json',JSON.stringify({viewports:8,experiments:40,errors},null,2));if(errors.length)throw Error(errors.join('\n'));console.log('LAB: 40 scenes, 8 viewports, redirect, zero errors');
