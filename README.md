# Browse Films SSR

A movie browsing application built with React, TypeScript, and Vite featuring Server-Side Rendering (SSR).

## Features

- **Movie Browsing**: Browse movies by different categories (Western, Documentary, Sci-Fi)
- **Movie Details**: Detailed view with additional movie information
- **Wishlist**: Add/remove movies from your personal wishlist
- **Responsive Design**: Works on desktop and mobile devices
- **Server-Side Rendering**: Improved SEO and initial load performance
- **TypeScript**: Full type safety throughout the application
- **Testing**: Comprehensive test suite with Vitest

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: SCSS, CSS Modules
- **State Management**: Zustand
- **Routing**: React Router
- **Testing**: Vitest, React Testing Library
- **Build**: Vite with SSR support
- **Fonts**: Custom themed fonts for different movie categories

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/browse-films-ssr.git
cd browse-films-ssr
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. For SSR development:
```bash
npm run build
npm run preview
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CategorySection/ # Movie category sections
│   ├── Header/         # Application header
│   ├── MovieCarousel/  # Movie carousel with cards
│   ├── UI/            # Basic UI components
│   └── WishlistButton/ # Wishlist functionality
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── styles/            # Global styles and fonts
```
