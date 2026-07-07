import { getInitialTheme, setTheme, THEME_STORAGE_KEY } from "./theme.service";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe("getInitialTheme", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("an explicit localStorage value wins over matchMedia", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    mockMatchMedia(false); // OS prefers light; stored value must still win
    expect(getInitialTheme()).toBe("dark");
  });

  test("falls back to matchMedia when localStorage is empty", () => {
    mockMatchMedia(true); // OS prefers dark
    expect(getInitialTheme()).toBe("dark");
  });

  test("falls back to light when neither localStorage nor matchMedia indicate dark", () => {
    mockMatchMedia(false);
    expect(getInitialTheme()).toBe("light");
  });
});

describe("setTheme", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  test("persists the choice to localStorage and updates the document dataset", () => {
    setTheme("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
