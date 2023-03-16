import { expect, test } from '@playwright/test';

test('start node', async ({ page }) => {
  await page.goto('/ci');
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('start');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/start.png' });
  const passed = page.getByTestId('passed');
  await page.waitForTimeout(3000);
  await expect(passed).toHaveText('true');
});

test('skvm', async ({ page }) => {
  await page.goto('/ci');
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('start_skvm');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/skvm.png' });
  const passed = page.getByTestId('skvm_passed');
  await page.waitForTimeout(3000);
  await expect(passed).toHaveText('true');
});

test('contract', async ({ page }) => {
  await page.goto('/ci');
  await page.waitForTimeout(1000);
  const startBtn = page.getByTestId('test_contract');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/contract.png' });
  const passed = page.getByTestId('contract_passed');
  await page.waitForTimeout(5000);
  await expect(passed).toHaveText('true');
});
