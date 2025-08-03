# Browse Films SSR

A movie browsing application built with React, TypeScript, and Vite featuring Server-Side Rendering (SSR).

<div align="center">
  
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CF649A?style=for-the-badge&logo=sass&logoColor=white)

</div>

## 📱 Screenshots

<div align="center">
  <img src="docs/images/Screenshot 2025-08-03 015938.png" alt="Home Page" width="45%">
  <img src="docs/images/Screenshot 2025-08-03 015954.png" alt="Movie Categories" width="45%">
</div>

<div align="center">
  <img src="docs/images/Screenshot 2025-08-03 020013.png" alt="Movie Details" width="45%">
  <img src="docs/images/Screenshot 2025-08-03 020030.png" alt="Movie Information" width="45%">
</div>

<div align="center">
  <img src="docs/images/Screenshot 2025-08-03 020040.png" alt="Wishlist Page" width="80%">
</div>

## 🚀 Features

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

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/davidaguirremolins/browse-movies-ssr.git
cd browse-movies-ssr
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
