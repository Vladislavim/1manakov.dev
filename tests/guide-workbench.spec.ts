import {test,expect} from '@playwright/test';

test('guide demonstrations change real UI and export observations',async({page})=>{
 await page.goto('/guides/pagination-or-load-more');
 const example=page.locator('.guide-live-example');
 await example.getByRole('navigation').getByRole('button',{name:'2',exact:true}).click();
 await example.getByRole('button',{name:/Подбор курса/}).click();
 await expect(example.getByRole('heading',{name:'Подбор курса'})).toBeVisible();
 await example.getByRole('button',{name:'← К результатам'}).click();
 await expect(example.getByRole('status')).toContainText('Страница 2 из 3');
 await page.getByRole('button',{name:'Исследовать подборку'}).click();
 await example.getByRole('button',{name:'Показать ещё 3 проекта'}).click();
 await expect(example.locator('.guide-demo-results button')).toHaveCount(6);
 await page.goto('/guides/dashboard-hierarchy-examples');
 await page.getByRole('button',{name:'Отметить обработанной'}).click();
 await expect(page.locator('.guide-dashboard-panel').first()).toContainText('Очередь обработана');
 await page.getByRole('button',{name:'Сравнить периоды'}).click();
 await expect(page.locator('.guide-dashboard-panel').first()).toContainText('СОПОСТАВИМЫЕ ДАННЫЕ');
 await page.goto('/guides/design-system-vs-ui-kit');
 await page.getByLabel('Токен accent').fill('#123456');
 await expect(page.locator('.guide-token-preview>div').nth(1)).toHaveCSS('border-color','rgb(18, 52, 86)');
 await page.getByLabel('Второй компонент использует токен').uncheck();
 await expect(page.locator('.guide-token-preview>div').nth(1)).not.toHaveCSS('border-color','rgb(18, 52, 86)');
 await page.goto('/guides/keyboard-navigation-checklist');
 await page.locator('.workbench-observation textarea').first().fill('В меню фокус не виден на третьей ссылке');
 await expect(page.locator('.workbench-result')).toContainText('1 наблюдений');
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'Скачать .txt'}).click();
 expect((await download).suggestedFilename()).toBe('design-notes.txt');
 await page.goto('/guides/empty-state-copy-examples');
 await page.locator('.workbench-preview').getByRole('button',{name:'Посмотреть проекты'}).click();
 await page.getByRole('button',{name:'Сайт мастерской · Сохранить'}).click();
 await expect(page.locator('.workbench-preview')).toContainText('Сохранён проект: Сайт мастерской');
});

test('guide tools calculate actual contrast and preserve editable output',async({page})=>{
 await page.goto('/guides/text-contrast-check');const box=page.locator('.guide-workbench');await box.locator('input[type=color]').nth(0).fill('#000000');await box.locator('input[type=color]').nth(1).fill('#ffffff');await expect(box.getByRole('status')).toContainText('21.00:1');await box.locator('input[type=color]').nth(1).fill('#000000');await expect(box.getByRole('status')).toContainText('1.00:1 — не проходит');
 await page.goto('/guides/website-prototype-scenario');await page.getByLabel('Что нужно сделать').fill('записаться на экскурсию');await expect(page.locator('.workbench-output')).toContainText('записаться на экскурсию');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Скачать .txt'}).click();expect((await download).suggestedFilename()).toBe('design-notes.txt');
 await page.goto('/guides/keyboard-navigation-checklist');await page.locator('.workbench-checks input').first().check();await expect(page.locator('.workbench-result')).toContainText('Проверено 1 из 6');
});

test('guide examples respond to validation, visibility, order and choices',async({page})=>{
 await page.goto('/guides/form-validation-timing');await page.getByRole('button',{name:'После отправки',exact:true}).click();await page.getByLabel('Учебный email').fill('bad');await expect(page.locator('#timing-feedback')).toContainText('ещё не показано');await page.getByRole('button',{name:'Проверить',exact:true}).click();await expect(page.getByLabel('Учебный email')).toHaveAttribute('aria-invalid','true');await page.getByLabel('Учебный email').fill('a@example.com');await page.getByRole('button',{name:'Проверить',exact:true}).click();await expect(page.locator('#timing-feedback')).toHaveText('Формат подходит.');
 await page.goto('/guides/password-input-design');await page.getByLabel('Учебный пароль').fill('example-only');await page.getByRole('button',{name:'Показать пароль'}).click();await expect(page.getByLabel('Учебный пароль')).toHaveAttribute('type','text');
 await page.goto('/guides/responsive-content-order');await page.getByRole('button',{name:'Блок 2 выше',exact:true}).click();await expect(page.locator('.order-preview strong').first()).toHaveText('Стоимость и условия');
 await page.goto('/guides/design-system-vs-ui-kit');await page.getByRole('button',{name:'Несколько продуктов'}).click();await expect(page.locator('.workbench-decision h3')).toHaveText('Нужны общие правила и владельцы');
 await page.goto('/guides/empty-state-copy-examples');await page.getByLabel('Заголовок',{exact:true}).fill('Нет экскурсий на эту дату');await expect(page.locator('.workbench-preview h3')).toHaveText('Нет экскурсий на эту дату');
});

test('guide dialog restores focus and loading has recovery',async({page})=>{
 await page.goto('/guides/modal-dialog-design');const launch=page.getByRole('button',{name:'Открыть учебный диалог'});await launch.click();await expect(page.getByRole('dialog')).toBeVisible();const scrollY=await page.evaluate(()=>window.scrollY);await page.getByRole('dialog').hover();await page.mouse.wheel(0,500);await page.waitForTimeout(150);expect(Math.abs(await page.evaluate(()=>window.scrollY)-scrollY)).toBeLessThan(2);await page.keyboard.press('Escape');await expect(launch).toBeFocused();
 await page.goto('/guides/loading-skeleton');await page.getByRole('button',{name:'Ошибка загрузки',exact:true}).click();await page.getByRole('button',{name:'Запустить пример'}).click();await expect(page.locator('.loading-preview')).toHaveAttribute('aria-busy','true');await expect(page.locator('.loading-preview h3')).toHaveText('Не удалось загрузить подборку');await page.getByRole('button',{name:'Скелетон',exact:true}).click();await page.getByRole('button',{name:'Запустить пример'}).click();await expect(page.locator('.loading-preview h3')).toHaveText('Проекты по вашему запросу');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/guides/interface-motion-rules');await page.locator('.motion-preview').click();await expect(page.locator('.motion-preview')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.motion-preview>span')).toHaveCSS('transition-duration','0s');
});

test('portfolio comparison, portrait and PDP development state',async({page})=>{
 await page.goto('/about');await expect(page.locator('.about-portrait image')).toHaveAttribute('href','/images/about/portrait-itmo.png');await expect(page.locator('.about-intro-copy')).toContainText('SEO');
 for(const slug of ['allnrg','pdp','khasaut-tour','vpn-equipment','legacy-rheumatology']){await page.goto(`/work/${slug}`);const figures=page.locator('.evidence-pair figure');await expect(figures).toHaveCount(2);const a=await figures.nth(0).boundingBox(),b=await figures.nth(1).boundingBox();expect(Math.abs(a!.y-b!.y)).toBeLessThan(2);}
 await page.goto('/work/pdp');await expect(page.locator('.external-project-pending')).toContainText('IN DEVELOPMENT');await expect(page.locator('a[href*="ooopdp.ru"]')).toHaveCount(0);await page.setViewportSize({width:390,height:844});const a=await page.locator('.evidence-pair figure').nth(0).boundingBox(),b=await page.locator('.evidence-pair figure').nth(1).boundingBox();expect(b!.y).toBeGreaterThan(a!.y+a!.height);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

