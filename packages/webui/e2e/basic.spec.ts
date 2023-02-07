import { expect, test } from '@playwright/test';

test('start node', async ({ page }) => {
  await page.goto('/ci');
  const startBtn = page.getByTestId('start');
  await startBtn.click();
  await page.screenshot({ path: './playwright-report/log.png' });
  const passed = page.getByTestId('passed');
  await page.waitForTimeout(2000);
  await expect(passed).toHaveText('true');
});
