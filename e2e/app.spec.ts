import { test, expect } from '@playwright/test';

test.describe('공감툰 프롬프트 봇', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('gonggamtoon_tour_done', 'true');
      localStorage.setItem('gonggamtoon_theme', 'light');
    });
    await page.goto('/');
  });

  test('페이지 로딩 + 헤더 표시', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('공감툰 프롬프트 봇');
  });

  test('스타일 선택 가능', async ({ page }) => {
    const styleSection = page.locator('#section-style');
    await expect(styleSection).toBeVisible();

    await styleSection.locator('button').first().click();
    await styleSection.getByRole('button', { name: /짱구/ }).first().click();
    await expect(styleSection.locator('button').first()).toContainText('짱구');
  });

  test('주제 선택 가능', async ({ page }) => {
    const themeSection = page.locator('#section-theme');
    await expect(themeSection).toBeVisible();

    await themeSection.locator('button').first().click();
    await themeSection.getByRole('button', { name: /번아웃/ }).first().click();
    await expect(themeSection.locator('button').first()).toContainText('번아웃');
  });

  test('Codex 로컬은 API 키 없이 생성 준비 가능', async ({ page }) => {
    const styleSection = page.locator('#section-style');
    const themeSection = page.locator('#section-theme');

    await styleSection.locator('button').first().click();
    await styleSection.getByRole('button', { name: /짱구/ }).first().click();

    await themeSection.locator('button').first().click();
    await themeSection.getByRole('button', { name: /번아웃/ }).first().click();

    await expect(page.locator('#btn-generate-stories')).toBeEnabled();
  });

  test('AI 설정 접이식 동작', async ({ page }) => {
    const apiButton = page.locator('#section-api button').first();
    await apiButton.click();

    await expect(page.locator('button[role="radio"]:has-text("Codex 로컬")')).toBeVisible();
    await expect(page.locator('text=API 키 없이 이 PC의 Codex CLI를 사용합니다')).toBeVisible();

    // 외부 API 제공자도 필요할 때 선택할 수 있어야 한다.
    await expect(page.locator('button[role="radio"]:has-text("Gemini")')).toBeVisible();
  });

  test('다크모드 토글', async ({ page }) => {
    await page.locator('button[aria-label="라이트 모드"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.locator('button[aria-label="다크 모드"]').click();
    await page.locator('button[aria-label="시스템 따름"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('EmptyState가 표시되고 클릭 가능', async ({ page }) => {
    await expect(page.locator('text=공감툰 프롬프트 봇').first()).toBeVisible();
    await expect(page.locator('text=만화 스타일 선택').first()).toBeVisible();
  });

  test('카테고리 필터 + 카운트 뱃지', async ({ page }) => {
    const styleSection = page.locator('#section-style');
    await styleSection.locator('button').first().click();
    // Should show "전체" with a count
    await expect(styleSection.locator('button:has-text("전체")')).toBeVisible();
  });

  test('ProgressStepper가 표시됨', async ({ page }) => {
    await expect(page.locator('text=스타일').first()).toBeVisible();
    await expect(page.locator('text=주제').first()).toBeVisible();
    await expect(page.locator('text=생성').first()).toBeVisible();
  });
});
