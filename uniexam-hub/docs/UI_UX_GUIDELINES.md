# UI & Styling Guide 🎨

UniExam Hub follows a clean, modern, and high-performance design system using **Tailwind CSS v4** and **OKLCH** color values.

---

## 🎨 Theming (OKLCH)

We use **OKLCH** because it provides more perceptually uniform colors and better results for dark mode and accessibility.

### Theme Variables (`app/app.css`):
*   `--primary`: The main brand color (OKLCH 0.6171 0.1375 39.0427).
*   `--background`: Global body background.
*   `--foreground`: Main text color.
*   `--card`: Background for cards and elevated components.

---

## 🌗 Dark Mode

Dark mode is implemented via the `.dark` class on the `<html>` element.

### Implementation:
1.  **State:** Controlled via the **Zustand** store (`useUIStore`).
2.  **Toggle:** Available in the `Header` component.
3.  **Styling:** Use `dark:` modifiers for conditional styles.
    *   *Example:* `<div className="bg-white dark:bg-slate-900">`

---

## 🧩 Reusable UI Components

Reusable components are located in `app/components/ui/`. These are atomic components designed for maximum reuse.

*   **Button:** Multiple variants (`default`, `outline`, `ghost`, `destructive`) and sizes (`sm`, `default`, `lg`).
*   **Input:** Accessible, styled inputs with custom focus rings.
*   **Forms:** Integration with `react-hook-form` and `zod`.

---

## 🏗️ Layout Principles

1.  **Sticky Header:** The header is sticky with a glassmorphism effect for easy navigation.
2.  **Footer:** A clean, multi-column footer for additional links.
3.  **Main Layout:** A unified wrapper ensuring the app always has consistent structure.

---

## ✨ Accessibility (A11y)

All components MUST be accessible.
*   Use semantic HTML tags (`main`, `nav`, `section`).
*   Maintain proper contrast ratios (OKLCH theme ensures this by default).
*   Use ARIA labels for icon-only buttons.
*   Ensure all forms are keyboard navigable.
