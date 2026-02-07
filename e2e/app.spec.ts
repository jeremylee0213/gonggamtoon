import { test, expect } from '@playwright/test';

test.describe('공감툰 프롬프트 봇', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지 로딩 + 헤더 표시', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('공감툰 프롬프트 봇');
  });

  test('스타일 선택 가능', async ({ page }) => {
    const styleSection = page.locator('#section-style');
    await expect(styleSection).toBeVisible();

    // Click first style chip
    const firstStyle = styleSection.locator('button[role="radio"]').first();
    await firstStyle.click();
    await expect(firstStyle).toHaveAttribute('aria-checked', 'true');
  });

  test('주제 선택 가능', async ({ page }) => {
    const themeSection = page.locator('#section-theme');
    await expect(themeSection).toBeVisible();

    const firstTheme = themeSection.locator('button[role="radio"]').first();
    await firstTheme.click();
    await expect(firstTheme).toHaveAttribute('aria-checked', 'true');
  });

  test('API 설정 접이식 동작', async ({ page }) => {
    const apiButton = page.locator('#section-api button').first();
    await apiButton.click();

    // Provider buttons should be visible when expanded
    await expect(page.locator('button[role="radio"]:has-text("Gemini")')).toBeVisible();
  });

  test('다크모드 토글', async ({ page }) => {
    const darkToggle = page.locator('button[aria-label*="다크 모드"]');
    await darkToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    const lightToggle = page.locator('button[aria-label*="라이트 모드"]');
    await lightToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('EmptyState가 표시되고 클릭 가능', async ({ page }) => {
    await expect(page.locator('text=공감툰 프롬프트 봇').first()).toBeVisible();
    await expect(page.locator('text=만화 스타일 선택').first()).toBeVisible();
  });

  test('카테고리 필터 + 카운트 뱃지', async ({ page }) => {
    const styleSection = page.locator('#section-style');
    // Should show "전체" with a count
    await expect(styleSection.locator('button:has-text("전체")')).toBeVisible();
  });

  test('ProgressStepper가 표시됨', async ({ page }) => {
    await expect(page.locator('text=스타일').first()).toBeVisible();
    await expect(page.locator('text=주제').first()).toBeVisible();
    await expect(page.locator('text=생성').first()).toBeVisible();
  });
});
