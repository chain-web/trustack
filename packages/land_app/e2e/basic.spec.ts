import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  page.on('console', (msg) => {
    let msgText = '';
    for (let i = 0; i < msg.args().length; ++i) {
      msgText += `${msg.args()[i]}`;
    }
    console.log(msgText);
  });
});

test('init page', async ({ page }) => {
  await page.goto('/');
});
