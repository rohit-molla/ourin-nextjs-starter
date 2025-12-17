# Ourin - The Ultimate Next.js Boilerplate

![License](https://img.shields.io/github/license/LuckyArch/ourin-nextjs-starter?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-cyan?style=flat-square&logo=tailwindcss)

**Ourin** is an opinionated, production-ready starter kit designed to help developers ship premium web applications in record time. Built on the bleeding edge of the React ecosystem, it combines the performance of **Next.js 16** (App Router) with the styling power of **Tailwind CSS 4** and the elegance of **Shadcn/UI**.

This isn't just a "Hello World" template. It's a complete architectural foundation packed with **145+ utility functions**, **15+ custom hooks**, a **multi-font typography system**, and a suite of pre-built, high-end UI components.

---

## 🚀 Key Features

### 🛠️ Core Stack & Architecture
-   **Next.js 16 (App Router)**: Utilizing React Server Components (RSC) by default for optimal performance and SEO.
-   **Tailwind CSS 4**: configured with the new Oxide engine for zero-runtime overhead and lightning-fast builds.
-   **TypeScript 5**:Strict typing enabled across the entire project to catch errors at compile time, not runtime.
-   **Shadcn/UI**: A collection of reusable components built with Radix UI and Tailwind CSS, fully accessible and customizable.
-   **Framer Motion**: Integrated for smooth, complex animations and gesture handling.
-   **Next Themes**: seamless dark/light mode toggle with system preference detection.

### 🎨 Design & Typography (New)
We've moved beyond standard font stacks. Ourin implements a robust **6-font typography system** providing a rich visual hierarchy:
-   **Display**: `Outfit` — Modern, geometric, perfect for headings and branding.
-   **Body**: `Plus Jakarta Sans` — Clean, highly legible sans-serif for main content.
-   **Serif**: `Playfair Display` — Elegant serif for quotes and premium accents.
-   **Mono**: `JetBrains Mono` — The gold standard for code blocks and technical data.
-   **Handwriting**: `Caveat` — For adding a personal, human touch to notes or signatures.
-   **UI/Metadata**: `Inter` — Neutral and versatile for small labels and dense interfaces.

### 🧰 The "Utils" Library (145+ Functions)
Stop copy-pasting code snippets from StackOverflow. We include a massive, categorized library of battle-tested utilities:
-   **`api.ts`**: Standardized fetch wrapper with error handling and interceptors.
-   **`array.ts`**: Helpers for grouping, chunking, deduplicating, and sorting arrays.
-   **`date.ts`**: Format relative time, duration, and local dates without heavy libraries like Moment.js.
-   **`format.ts`**: currency, file size, percentage, and phone number formatting.
-   **`string.ts`**: Slugify, truncate, capitalize, camelCase/kebabCase converters.
-   **`validation.ts`**: Regex patterns for emails, passwords, URLs, and credit cards.
-   **`dom.ts`**: Safe browser-only execution helpers (copy to clipboard, scroll to top).
-   **`color.ts`**: Hex/RGB/HSL conversion and contrast ratio calculations.

### 🪝 Custom Hooks Collection
A ready-to-use arsenal of React hooks to handle common state logic:
-   `useDebounce`: Delay function execution (perfect for search inputs).
-   `useLocalStorage`: Persist state to browser storage with type safety.
-   `useMediaQuery`: Responsive design logic in JS.
-   `useOnClickOutside`: Detect clicks outside a component (modals/dropdowns).
-   `useScrollPosition`: Track window scroll for sticky navs or animations.
-   `useWindowSize`: Reactive viewport dimensions.
-   `useAsync`: Handle async operations with loading/error states.
-   `useToggle`, `usePrevious`, `useHover`, `useThrottle`, and more.

### 🧩 Premium Components
-   **Floating Navbar**: A glassmorphism navigation bar that intelligently hides on scroll down and reveals on scroll up.
-   **Bento Grid**: A responsive, grid-based layout for showcasing features or portfolio items.
-   **Code Typewriter**: A realistic code editor component with typing animations.
-   **Copy Command**: A sleek, terminal-style component for copying CLI commands (pill-shaped design).
-   **Hero Background**: An animated, modern background with spotlight and aurora effects.

---

## 🏁 Getting Started

### Prerequisites
-   Node.js 18+ or later
-   pnpm (recommended), npm, or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/LuckyArch/ourin-nextjs-starter.git
    cd ourin-nextjs-starter
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:3000` to see the application running.

---

## 📂 Project Structure

A highly organized codebase designed for scalability.

```
/
├── app/                  # Next.js App Router root
│   ├── globals.css       # Global styles, Tailwind base, and theme variables
│   ├── layout.tsx        # Root layout with ThemeProvider and Font configurations
│   └── page.tsx          # Homepage demoing all components
├── components/           # React components
│   ├── ui/               # Shadcn/UI primitive components (buttons, inputs, etc.)
│   ├── theme-toggle.tsx  # Dark mode switcher
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks (useDebounce, useLocalStorage, etc.)
├── lib/                  # Library code
│   └── utils/            # The massive utility function collection
│       ├── api.ts
│       ├── array.ts
│       └── ...
├── constants/            # Application-wide constants (config, exact strings)
├── types/                # Global TypeScript definitions
└── config/               # Site configuration (metadata, nav links)
```

---

## 🔧 Configuration

### Customizing Fonts
Fonts are loaded in `app/layout.tsx` using `next/font/google`. To change them:
1.  Import your desired font from `next/font/google`.
2.  Define the variable name (e.g., `--font-brand`).
3.  Add it to the `body` class string.
4.  Update `app/globals.css` to map the variable to a Tailwind class.

### Theming
The project uses CSS variables for theming in `app/globals.css`.
-   **Light Mode**: Defined in the `:root` scope.
-   **Dark Mode**: Defined in the `.dark` scope.

You can adjust primary colors, background shades, and border radii by modifying the HSL values in these blocks.

---

## 🤝 Contributing

We welcome contributions! If you have an idea for a new utility function, a better hook, or a UI improvement:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

This project is open-source and available under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

Built with ❤️ by [FauzanAPP](https://github.com/LuckyArch).
