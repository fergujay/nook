import { expect, test } from '@playwright/test'

test('home page renders hero and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nook/i)
  await expect(page.getByRole('navigation').first()).toBeVisible()
})

test('products page loads and shows products', async ({ page }) => {
  await page.goto('/products')
  await expect(page).toHaveURL(/\/products/)
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()
})

test('deep link to product detail resolves without 404', async ({ page }) => {
  await page.goto('/products/1')
  await expect(page.locator('main').first()).toBeVisible()
})
