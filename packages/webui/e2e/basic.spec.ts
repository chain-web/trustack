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

test('start node', async ({ page }) => {
  await page.goto('/ci');
  await page.screenshot({ path: './playwright-report/start-0.png' });
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('start');
  await page.screenshot({ path: './playwright-report/start-1.png' });
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/start-2.png' });
  const passed = page.getByTestId('passed');
  await page.waitForTimeout(6000);
  await expect(passed).toHaveText('true');
});

test('skvm', async ({ page }) => {
  await page.goto('/ci');
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('start_skvm');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/skvm.png' });
  const passed = page.getByTestId('skvm_passed');
  await page.waitForTimeout(6000);
  await expect(passed).toHaveText('true');
});

test('contract', async ({ page }) => {
  await page.goto('/ci');
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('test_contract');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/contract.png' });
  const passed = page.getByTestId('contract_passed');
  await page.waitForTimeout(6000);
  await expect(passed).toHaveText('true');
});
