import '@testing-library/jest-dom/vitest';

// JSDOM does not implement scrollIntoView
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
