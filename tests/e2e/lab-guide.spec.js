// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Helper: open a lab by expanding its module group then clicking the nav-lab link.
 * Nav-lab text is shortened: "LAB 1.1: System Prompts..." → "1.1 System Prompts..."
 * Groups start collapsed, so we must expand the parent .nav-group-header first.
 */
async function openLab(page, labNum) {
  // labNum like "1.1" → module is first digit
  const moduleNum = labNum.split('.')[0];
  // Expand the module group header (text starts with module number + ".")
  const groupHeader = page.locator('.nav-group-header', { hasText: new RegExp(`^${moduleNum}\\.\\s`) });
  // Only click to open if not already open
  const isOpen = await groupHeader.evaluate(el => el.classList.contains('open'));
  if (!isOpen) {
    await groupHeader.click();
    await page.waitForTimeout(200);
  }
  // Click the nav-lab whose text starts with the lab number
  const navLab = page.locator('a.nav-lab', { hasText: new RegExp(`^\\s*${labNum.replace('.', '\\.')}\\s`) });
  await navLab.click();
  await page.waitForTimeout(200);
}

/**
 * Helper: open Practice Exam section via sidebar.
 */
async function openExam(page) {
  await page.locator('.nav-group-header.type-exam').click();
  await page.waitForTimeout(300);
}

/**
 * Helper: start exam in given mode.
 */
async function startExam(page, mode) {
  await openExam(page);
  if (mode === 'study') {
    await page.locator('#ebtn-study').click();
  } else {
    await page.locator('#ebtn-exam').click();
  }
  await page.getByRole('button', { name: 'Start Exam' }).click();
  await expect(page.locator('#exam-question.exam-active')).toBeVisible();
}

test.describe('Lab Guide E2E', () => {

  test('Test 1: Page loads and sidebar renders', async ({ page }) => {
    await page.goto('/lab-guide.html');

    // Title check
    await expect(page).toHaveTitle(/Claude Certified Architect/);

    // Sidebar visible
    await expect(page.locator('#sidebar')).toBeVisible();

    // Nav list has at least 30 nav-lab entries in the DOM (even if inside collapsed groups)
    const navLabs = page.locator('a.nav-lab');
    await expect(navLabs).not.toHaveCount(0);
    const count = await navLabs.count();
    expect(count).toBeGreaterThanOrEqual(30);

    // Main content area visible
    await expect(page.locator('#content')).toBeVisible();
  });

  test('Test 2: Clicking a lab section shows that section', async ({ page }) => {
    await page.goto('/lab-guide.html');

    // Expand Module 1 and click Lab 1.1
    await openLab(page, '1.1');

    // Only one content section should be visible
    const visibleSections = page.locator('.content-section:visible');
    await expect(visibleSections).toHaveCount(1);

    // The visible section should contain LAB 1.1
    await expect(visibleSections.first()).toContainText(/LAB 1\.1/i);
  });

  test('Test 3: Switching between labs swaps sections', async ({ page }) => {
    await page.goto('/lab-guide.html');

    // Click Lab 1.1
    await openLab(page, '1.1');
    let visibleSections = page.locator('.content-section:visible');
    await expect(visibleSections).toHaveCount(1);
    await expect(visibleSections.first()).toContainText(/LAB 1\.1/i);

    // Click Lab 2.3
    await openLab(page, '2.3');
    visibleSections = page.locator('.content-section:visible');
    await expect(visibleSections).toHaveCount(1);
    await expect(visibleSections.first()).toContainText(/LAB 2\.3/i);

    // Click Lab 5.6
    await openLab(page, '5.6');
    visibleSections = page.locator('.content-section:visible');
    await expect(visibleSections).toHaveCount(1);
    await expect(visibleSections.first()).toContainText(/LAB 5\.6/i);
  });

  test('Test 4: Search filters sidebar', async ({ page }) => {
    await page.goto('/lab-guide.html');

    const searchInput = page.locator('#searchInput');
    await expect(searchInput).toBeVisible();

    // Count total nav-lab elements in the DOM (they exist even in collapsed groups)
    const allNavLabs = page.locator('a.nav-lab');
    const totalInDom = await allNavLabs.count();
    expect(totalInDom).toBeGreaterThan(0);

    // Type search term — search opens all matching groups and hides non-matching items
    await searchInput.fill('tool choice');
    await page.waitForTimeout(300);

    // At least one nav-lab should be visible (search opens matching groups)
    const visibleNavLabs = page.locator('a.nav-lab:visible');
    const visibleCount = await visibleNavLabs.count();
    expect(visibleCount).toBeGreaterThan(0);

    // Some nav-labs should be filtered out (hidden via display:none on the element)
    const hiddenNavLabs = page.locator('a.nav-lab[style*="display: none"], a.nav-lab[style*="display:none"]');
    const hiddenCount = await hiddenNavLabs.count();
    expect(hiddenCount).toBeGreaterThan(0);

    // Clear search — all nav items should return to DOM (groups re-collapse but items exist)
    await searchInput.fill('');
    await page.waitForTimeout(300);

    // After clearing, no nav-labs should have inline display:none
    const stillHidden = await page.locator('a.nav-lab[style*="display: none"], a.nav-lab[style*="display:none"]').count();
    expect(stillHidden).toBe(0);
  });

  test('Test 5: Practice Exam sidebar entry exists and opens', async ({ page }) => {
    await page.goto('/lab-guide.html');

    // Find and click Practice Exam in sidebar
    const examHeader = page.locator('.nav-group-header.type-exam');
    await expect(examHeader).toBeVisible();
    await examHeader.click();
    await page.waitForTimeout(300);

    // The exam welcome screen should be visible
    await expect(page.locator('#exam-welcome.exam-active')).toBeVisible();

    // Mode toggle present
    await expect(page.locator('#ebtn-exam')).toBeVisible();
    await expect(page.locator('#ebtn-study')).toBeVisible();

    // Start button present (use specific text to avoid matching Restart button)
    await expect(page.getByRole('button', { name: 'Start Exam' })).toBeVisible();

    // Three metric cards
    const metricCards = page.locator('.em-card');
    await expect(metricCards).toHaveCount(3);

    // Check metric values: 60 questions, 720 pass score
    await expect(page.locator('.em-val').nth(0)).toContainText('60');
    await expect(page.locator('.em-val').nth(1)).toContainText('720');
  });

  test('Test 6: Start exam in Study Mode and answer Q1', async ({ page }) => {
    await page.goto('/lab-guide.html');
    await startExam(page, 'study');

    // Q1 text visible
    await expect(page.locator('#eqnum')).toContainText('Question 1 of 60');
    await expect(page.locator('#eqtext')).toBeVisible();

    // 4 choices
    const choices = page.locator('.eq-choice');
    await expect(choices).toHaveCount(4);

    // Click choice A
    await choices.nth(0).click();

    // In Study Mode, explanation appears immediately
    const explanation = page.locator('#eqexpl');
    await expect(explanation).toBeVisible();

    // Explanation should have content
    const explText = await explanation.textContent();
    expect(explText.length).toBeGreaterThan(0);

    // Click Next
    await page.locator('#ebtn-next').click();

    // Q2 renders
    await expect(page.locator('#eqnum')).toContainText('Question 2 of 60');
  });

  test('Test 7: Navigate review screen and jump to a question', async ({ page }) => {
    await page.goto('/lab-guide.html');
    await startExam(page, 'study');

    // Answer Q1 with choice B
    await page.locator('.eq-choice').nth(1).click();
    await page.waitForTimeout(200);

    // Click Next
    await page.locator('#ebtn-next').click();
    await expect(page.locator('#eqnum')).toContainText('Question 2 of 60');

    // Answer Q2 with choice A
    await page.locator('.eq-choice').nth(0).click();
    await page.waitForTimeout(200);

    // Click Review all questions
    await page.locator('.eq-revlink').click();

    // Review screen visible
    await expect(page.locator('#exam-review.exam-active')).toBeVisible();

    // Grid has 60 cells
    const gridCells = page.locator('.egrid-cell');
    await expect(gridCells).toHaveCount(60);

    // Q1 and Q2 should be answered (class .eans)
    await expect(gridCells.nth(0)).toHaveClass(/eans/);
    await expect(gridCells.nth(1)).toHaveClass(/eans/);

    // Q3 should be unanswered
    await expect(gridCells.nth(2)).toHaveClass(/eunans/);

    // Click Q1 cell to jump back
    await gridCells.nth(0).click();

    // Should be back on question screen with Q1
    await expect(page.locator('#exam-question.exam-active')).toBeVisible();
    await expect(page.locator('#eqnum')).toContainText('Question 1 of 60');

    // Choice B should still be marked as the user's selection.
    // In Study Mode, after revealing the answer, the class changes from
    // 'esel' to 'ewrong' (if wrong) or 'ecorrect' (if correct).
    // Either class proves the selection was preserved through the round-trip.
    const choiceB = page.locator('.eq-choice').nth(1);
    const choiceBClass = await choiceB.getAttribute('class');
    expect(choiceBClass).toMatch(/esel|ewrong|ecorrect/);
  });

  test('Test 8: Timer runs in Exam Mode and does NOT run in Study Mode', async ({ page }) => {
    await page.goto('/lab-guide.html');
    await startExam(page, 'exam');

    // Wait for the timer to populate (it updates via setInterval every 500ms)
    await expect(page.locator('#etimer')).toHaveText(/\d+:\d{2}/, { timeout: 3000 });

    // Grab timer text
    const timer1 = await page.locator('#etimer').textContent();
    expect(timer1).toMatch(/^\d+:\d{2}$/);

    // Wait 2.5 seconds
    await page.waitForTimeout(2500);

    // Timer should have decreased
    const timer2 = await page.locator('#etimer').textContent();
    const parseTimer = (t) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };
    expect(parseTimer(timer2)).toBeLessThan(parseTimer(timer1));

    // Now test Study Mode — reload the page fresh
    await page.goto('/lab-guide.html');
    await startExam(page, 'study');

    // In Study Mode, timer should not be visible or should be static
    const timerVisible = await page.locator('#etimer').isVisible();
    if (timerVisible) {
      const studyTimer = await page.locator('#etimer').textContent();
      await page.waitForTimeout(2000);
      const studyTimer2 = await page.locator('#etimer').textContent();
      expect(studyTimer2).toBe(studyTimer);
    }
    // If not visible, that's also acceptable
  });

  test('Test 9: Timer pauses when switching away from exam', async ({ page }) => {
    await page.goto('/lab-guide.html');
    await startExam(page, 'exam');

    // Wait for timer to populate then tick for 2 seconds
    await expect(page.locator('#etimer')).toHaveText(/\d+:\d{2}/, { timeout: 3000 });
    await page.waitForTimeout(2000);

    // Grab timer value
    const timerBefore = await page.locator('#etimer').textContent();
    const parseTimer = (t) => {
      const [m, s] = t.split(':').map(Number);
      return m * 60 + s;
    };
    const secondsBefore = parseTimer(timerBefore);

    // Navigate away — click a lab in the sidebar
    await openLab(page, '1.1');

    // Verify we navigated away
    await expect(page.locator('.content-section:visible')).toHaveCount(1);

    // Wait 5 seconds while on the lab page
    await page.waitForTimeout(5000);

    // Navigate back to Practice Exam
    await page.locator('.nav-group-header.type-exam').click();
    await page.waitForTimeout(500);

    // Grab timer value again
    const timerAfter = await page.locator('#etimer').textContent();
    const secondsAfter = parseTimer(timerAfter);

    // Timer should be within ~2 seconds of the paused value
    // (not 5+ seconds less, which would mean it kept counting)
    const drift = secondsBefore - secondsAfter;
    expect(drift).toBeLessThanOrEqual(2);
  });

  test('Test 10: Submit exam and see results screen', async ({ page }) => {
    await page.goto('/lab-guide.html');
    await startExam(page, 'study');

    // Answer Q1 with choice A
    await page.locator('.eq-choice').nth(0).click();
    await page.waitForTimeout(200);

    // Go to Review
    await page.locator('.eq-revlink').click();
    await expect(page.locator('#exam-review.exam-active')).toBeVisible();

    // Handle confirmation dialog and click Submit
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Submit Exam' }).click();

    // Results screen renders
    await expect(page.locator('#exam-results.exam-active')).toBeVisible();

    // Score display visible (pass/fail badge)
    await expect(page.locator('.eres-badge')).toBeVisible();

    // 5-domain breakdown renders
    const domainRows = page.locator('.edom-row');
    await expect(domainRows).toHaveCount(5);

    // Results grid has 60 clickable cells
    const resultCells = page.locator('#eres-grid .egrid-cell');
    const cellCount = await resultCells.count();
    expect(cellCount).toBe(60);

    // Click first cell
    await resultCells.first().click();

    // Detail view should appear
    const detail = page.locator('#edetail');
    await expect(detail).toBeVisible();

    // Detail should show question text and choices
    const detailText = await detail.textContent();
    expect(detailText.length).toBeGreaterThan(50);
  });

  test('Test 11: Bottom nav buttons advance to next section', async ({ page }) => {
    await page.goto('/lab-guide.html');

    // Navigate to Lab 1.2 via sidebar
    await openLab(page, '1.2');
    await page.waitForTimeout(300);

    // Verify Lab 1.2 section is visible
    const visibleBefore = page.locator('.content-section:visible');
    await expect(visibleBefore).toHaveCount(1);

    // Scroll to bottom and click the Next button
    const nextBtn = page.locator('.content-section:visible .lesson-nav-btn.lesson-nav-next');
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    await page.waitForTimeout(300);

    // New section is visible and is NOT Lab 1.2
    const visibleAfter = page.locator('.content-section:visible');
    await expect(visibleAfter).toHaveCount(1);
    const newH1 = await visibleAfter.first().locator('h1').first().textContent();
    expect(newH1).not.toMatch(/LAB 1\.2/i);

    // (c) Scroll position is at the top (within 100px)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);

    // Cross-module: navigate to Lab 1.7 and click Next
    await openLab(page, '1.7');
    await page.waitForTimeout(300);

    const nextBtn2 = page.locator('.content-section:visible .lesson-nav-btn.lesson-nav-next');
    await nextBtn2.scrollIntoViewIfNeeded();
    await nextBtn2.click();
    await page.waitForTimeout(300);

    // New section is visible and is NOT Lab 1.7
    const visibleCross = page.locator('.content-section:visible');
    await expect(visibleCross).toHaveCount(1);
    const crossH1 = await visibleCross.first().locator('h1').first().textContent();
    expect(crossH1).not.toMatch(/LAB 1\.7/i);
  });

});
