import { test, expect } from '@playwright/test'

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should create a new list and add cards', async ({ page }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Backlog')
    await page.click('button:has-text("Add")')

    await expect(page.locator('h3:has-text("Backlog")')).toBeVisible()

    await page.click('button:has-text("+ Add Card")')
    await page.fill('input[aria-label="New card title"]', 'First Task')
    await page.click('button:has-text("Add")')

    await expect(page.locator('h4:has-text("First Task")')).toBeVisible()
  })

  test('should edit a card', async ({ page }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Todo')
    await page.click('button:has-text("Add")')

    await page.click('button:has-text("+ Add Card")')
    await page.fill('input[aria-label="New card title"]', 'Edit Me')
    await page.click('button:has-text("Add")')

    await page.click('text=Edit Me')

    await page.fill('#card-title', 'Updated Title')
    await page.fill('#card-description', 'New description')
    await page.click('button:has-text("Save")')

    await expect(page.locator('h4:has-text("Updated Title")')).toBeVisible()
  })

  test('should drag and drop card between lists', async ({ page }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Todo')
    await page.click('button:has-text("Add")')

    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Done')
    await page.click('button:has-text("Add")')

    await page.click('button:has-text("+ Add Card")')
    await page.fill('input[aria-label="New card title"]', 'Drag Me')
    await page.click('button:has-text("Add")')

    const card = page.locator('text=Drag Me')
    const doneList = page.locator('text=Done').locator('..')

    await card.dragTo(doneList)
  })

  test('should work offline and sync when online', async ({ page, context }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Offline List')
    await page.click('button:has-text("Add")')

    await context.setOffline(true)
    await expect(page.locator('text=Offline')).toBeVisible()

    await page.click('button:has-text("+ Add Card")')
    await page.fill('input[aria-label="New card title"]', 'Offline Card')
    await page.click('button:has-text("Add")')

    await expect(page.locator('h4:has-text("Offline Card")')).toBeVisible()

    await context.setOffline(false)
    await expect(page.locator('text=Online')).toBeVisible()
  })

  test('should persist data after reload', async ({ page }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Persistent List')
    await page.click('button:has-text("Add")')

    await page.click('button:has-text("+ Add Card")')
    await page.fill('input[aria-label="New card title"]', 'Persistent Card')
    await page.click('button:has-text("Add")')

    await page.reload()

    await expect(page.locator('h3:has-text("Persistent List")')).toBeVisible()
    await expect(page.locator('h4:has-text("Persistent Card")')).toBeVisible()
  })

  test('should archive a list', async ({ page }) => {
    await page.click('button:has-text("+ Add List")')
    await page.fill('input[aria-label="New list title"]', 'Archive Me')
    await page.click('button:has-text("Add")')

    await page.click('button[aria-label="Archive list Archive Me"]')
    await page.click('button:has-text("Confirm")')

    await expect(page.locator('h3:has-text("Archive Me")')).not.toBeVisible()
  })

  test('should be keyboard accessible', async ({ page }) => {
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    await page.keyboard.type('Keyboard List')
    await page.keyboard.press('Enter')

    await expect(page.locator('h3:has-text("Keyboard List")')).toBeVisible()
  })
})
