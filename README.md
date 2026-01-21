# behan.dev

A personal website and blog built with [SvelteKit](https://svelte.dev/docs/kit) and [Tailwind CSS](https://tailwindcss.com). Features include a responsive design, animated logo, blog posts, recipes, links, about pages, and accessibility options.

## Live Site

Visit the live site at: [https://greenorchid.github.io/](https://greenorchid.github.io/)

## Features

- **Blog**: Personal thoughts and technical articles
- **Recipes**: Cooking recipes with ingredients and instructions
- **Links**: Curated interesting links and resources
- **About**: Personal information and contact details
- **Responsive Design**: Mobile-first with hamburger navigation
- **Animations**: Smooth transitions and logo animations
- **Dark Mode**: Theme toggle with system preference detection
- **Accessibility**: Font size controls, reduced motion options

## Tech Stack

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/greenorchid/greenorchid.github.io.git
   cd greenorchid.github.io
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Testing

- **Unit Tests**: `npm run test:unit`
- **E2E Tests**: `npm run test:e2e`
- **All Tests**: `npm test`

Tests include navigation, accessibility toggles, and mobile responsiveness.

## Building

To create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Deployment

The site is configured for automatic deployment to GitHub Pages via GitHub Actions. On push to `main`, it runs tests, builds, and deploys.

To deploy manually:

1. Build the project
2. Commit and push to `main`
3. GitHub Actions handles the rest

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   ├── blog/           # Blog posts
│   ├── recipes/        # Recipes
│   └── utils.ts        # Utility functions
├── routes/             # Page routes
│   ├── blog/           # Blog pages
│   ├── recipes/        # Recipe pages
│   └── ...
└── static/             # Static assets (robots.txt, humans.txt)
```

## Contributing

This is a personal project, but feel free to open issues or PRs for improvements.

## License

See [LICENSE](LICENSE) file.

## Acknowledgments

- Built with [SvelteKit](https://svelte.dev/docs/kit)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons from [Heroicons](https://heroicons.com)
