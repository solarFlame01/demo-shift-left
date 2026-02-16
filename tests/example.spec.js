// tests/todo.spec.js
const { test, expect } = require('@playwright/test');

test('aggiunge un todo', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('.new-todo', 'Buy milk');
  await page.keyboard.press('Enter');
  await expect(page.locator('.todo-list li')).toHaveText(['Buy milk']);
});
