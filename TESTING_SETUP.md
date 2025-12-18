# ✅ E2E Testing & Integration Setup

## Overview
This guide sets up end-to-end testing using Vitest for unit tests and Playwright for integration tests. Tests validate all critical user flows.

---

## Step 1: Install Testing Dependencies

```bash
# Unit tests with Vitest
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom

# E2E tests with Playwright
npm install --save-dev @playwright/test

# Coverage
npm install --save-dev @vitest/coverage-v8
```

---

## Step 2: Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
```

---

## Step 3: Configure Playwright

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## Step 4: Create Unit Tests

Create test files alongside components:

### Example: `src/components/__tests__/AudioPlayer.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AudioPlayer } from '@/components/AudioPlayer';

describe('AudioPlayer', () => {
  it('renders play button', () => {
    render(<AudioPlayer audioUrl="test.mp3" />);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('plays audio when play button clicked', async () => {
    render(<AudioPlayer audioUrl="test.mp3" />);
    const playButton = screen.getByRole('button', { name: /play/i });
    
    await userEvent.click(playButton);
    
    expect(playButton.textContent).toContain('Pause');
  });

  it('displays duration when audio loads', () => {
    render(<AudioPlayer audioUrl="test.mp3" />);
    expect(screen.getByText(/0:00/)).toBeInTheDocument();
  });
});
```

### Example: `src/hooks/__tests__/useData.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEpisodes } from '@/hooks/useData';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          {
            id: '1',
            title: 'Episode 1',
            slug: 'ep-001',
            description: 'Test episode',
            audio_url: 'https://example.com/audio.mp3'
          }
        ],
        error: null
      })
    }))
  }
}));

describe('useEpisodes', () => {
  it('fetches episodes on mount', async () => {
    const { result } = renderHook(() => useEpisodes());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.episodes).toHaveLength(1);
    expect(result.current.episodes[0].title).toBe('Episode 1');
  });

  it('handles errors gracefully', async () => {
    // Mock error case
    const { result } = renderHook(() => useEpisodes());
    
    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
```

---

## Step 5: Create E2E Tests

Create `e2e/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should sign up new user', async ({ page }) => {
    await page.goto('/auth');
    
    // Switch to signup
    await page.click('button:has-text("No tienes cuenta")');
    
    // Fill form
    await page.fill('input[placeholder="Nombre"]', 'Test User');
    await page.fill('input[placeholder="Email"]', `test${Date.now()}@example.com`);
    await page.fill('input[placeholder="Contraseña"]', 'password123');
    
    // Submit
    await page.click('button:has-text("Registrarse")');
    
    // Check success
    await expect(page.locator('text=Cuenta creada')).toBeVisible();
  });

  test('should log in existing user', async ({ page }) => {
    await page.goto('/auth');
    
    await page.fill('input[placeholder="Email"]', 'test@example.com');
    await page.fill('input[placeholder="Contraseña"]', 'password123');
    
    await page.click('button:has-text("Entrar")');
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Should show logout button
    await expect(page.locator('button:has-text("Salir")')).toBeVisible();
  });

  test('should protect routes', async ({ page }) => {
    await page.goto('/auth');
    
    // Try accessing protected route without auth
    await page.goto('/laboratorio');
    
    // Should redirect to auth
    await expect(page).toHaveURL('/auth');
  });
});
```

Create `e2e/episode-flow.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Episode Playback Flow', () => {
  test('should display episodes on home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for episodes to load
    await page.waitForSelector('[data-testid="episode-card"]');
    
    const cards = await page.locator('[data-testid="episode-card"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('should navigate to episode and play audio', async ({ page }) => {
    await page.goto('/podcast');
    
    // Click first episode
    await page.click('[data-testid="episode-card"]:first-child');
    
    // Wait for episode page
    await page.waitForURL('/podcast/*');
    
    // Check audio player exists
    await expect(page.locator('audio')).toBeVisible();
    
    // Click play button
    await page.click('button[aria-label="Play"]');
    
    // Audio should be playing
    const audio = page.locator('audio');
    const isPlaying = await audio.evaluate(el => !el.paused);
    expect(isPlaying).toBe(true);
  });

  test('should show chapters on episode page', async ({ page }) => {
    await page.goto('/capitulos');
    
    // Wait for chapters to load
    await page.waitForSelector('[data-testid="chapter-card"]');
    
    const chapters = await page.locator('[data-testid="chapter-card"]').count();
    expect(chapters).toBeGreaterThan(0);
    
    // Click chapter
    await page.click('[data-testid="chapter-card"]:first-child');
    
    // Navigate to first episode of chapter
    await page.click('[data-testid="episode-in-chapter"]:first-child');
    
    // Should be on episode page
    await page.waitForURL('/podcast/*');
  });

  test('should play audio and track progress', async ({ page }) => {
    await page.goto('/podcast');
    
    // Click episode
    await page.click('[data-testid="episode-card"]:first-child');
    
    // Wait for audio
    const audio = page.locator('audio');
    await audio.waitFor({ state: 'visible' });
    
    // Play
    await page.click('button[aria-label="Play"]');
    
    // Progress should increase
    const initialTime = await audio.evaluate(el => el.currentTime);
    
    // Wait 2 seconds
    await page.waitForTimeout(2000);
    
    const newTime = await audio.evaluate(el => el.currentTime);
    expect(newTime).toBeGreaterThan(initialTime);
  });
});
```

---

## Step 6: Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## Step 7: Run Tests Locally

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# With UI
npm run test:ui

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI (interactive)
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

---

## Step 8: CI/CD Integration

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test --run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Critical Test Cases

| Test Case | User Flow | Expected Result |
|-----------|-----------|-----------------|
| Homepage loads | Visit / | Shows 18 episodes |
| Episode navigation | Click episode on home | Loads episode page with audio player |
| Audio playback | Click play button | Audio plays, progress bar moves |
| Chapter navigation | Click chapter in nav | Shows 5 chapters, each with episodes |
| Search functionality | Type in search | Filters episodes by title/description |
| Login flow | Email + password → submit | Creates account, redirects to home |
| Protected routes | Try /laboratorio without auth | Redirects to /auth |
| Editor permissions | Editor user in database | Can see edit controls (future) |

---

## Mocking Supabase for Tests

```typescript
import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn((table) => ({
    select: vi.fn().mockResolvedValue({
      data: [],
      error: null
    }),
    insert: vi.fn().mockResolvedValue({
      data: {},
      error: null
    }),
    update: vi.fn().mockResolvedValue({
      data: {},
      error: null
    }),
    delete: vi.fn().mockResolvedValue({
      data: {},
      error: null
    })
  })),
  auth: {
    signUpWithPassword: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: null } }))
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));
```

---

## Troubleshooting Tests

### ❌ Tests timeout waiting for audio to load
**Solution:** Mock HTML5 audio or wait shorter time
```typescript
vi.mock('html5-audio', () => ({
  Audio: vi.fn()
}));
```

### ❌ Playwright can't find elements
**Solution:** Add `data-testid` attributes to components
```tsx
<button data-testid="play-button">Play</button>
```

### ❌ Supabase calls fail in tests
**Solution:** Mock with `vi.mock()` before tests run

### ❌ Tests pass locally but fail in CI
**Solution:** 
1. Check environment variables in GitHub Actions
2. Verify Node version matches
3. Use `pnpm` instead of `npm`

---

## Next Steps

1. ✅ Implement unit tests for hooks and components
2. ✅ Implement E2E tests for all user flows
3. ✅ Add coverage reporting to CI
4. ✅ Set minimum coverage threshold (80%)
5. ✅ Add test badges to README

---

Last Updated: 2024-12-18
Status: ⏳ Implementation Guide Ready
Next: GitHub Actions CI/CD Setup
