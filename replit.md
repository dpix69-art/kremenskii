# Artist Portfolio Website

## Overview

A minimal editorial website for a contemporary artist featuring artwork galleries, sound projects, and personal statements. Built with React, TypeScript, and Tailwind CSS, the site emphasizes clean typography, generous whitespace, and content-first design. The project implements a modern full-stack architecture with separate client and server components, designed to showcase visual and audio artworks in a sophisticated, gallery-like presentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing with pages for Home, Gallery, Sounds, Statement, and Contacts
- **UI Framework**: Tailwind CSS with custom design system based on neutral colors and typography-focused layout
- **Component Library**: Radix UI primitives for accessible, unstyled components with custom styling via shadcn/ui patterns
- **State Management**: TanStack Query for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for consistent typing across client and server
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Development Setup**: Hot module replacement with Vite integration for full-stack development

### Design System
- **Typography**: Inter and IBM Plex Sans font stack with defined type scales (H1: 40px, H2: 30px, H3: 22px, Body: 17px)
- **Color Palette**: Monochrome approach with neutral colors (background: #FFFFFF, foreground: #0A0A0A, muted: #666666)
- **Layout System**: CSS Grid with responsive breakpoints and consistent spacing using Tailwind's 4px base unit
- **Component Patterns**: Reusable components for gallery grids, artwork details, sound projects, and navigation

### Content Architecture
- **Gallery Structure**: Hierarchical organization with series (Farbkoerper, PGSRD, Singles, Graphics) containing individual artworks
- **Media Handling**: Support for high-resolution images (≥2000px), audio files, and embedded media players
- **Navigation**: Structured routing with series pages, individual artwork pages, and sound project details
- **Responsive Design**: Mobile-first approach with desktop enhancements for optimal viewing across devices

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Client-side data fetching and caching for API interactions
- **wouter**: Lightweight routing library for single-page application navigation
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for cloud deployment

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible, unstyled UI primitives including dialogs, dropdowns, navigation menus
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

### Development Tools
- **typescript**: Static type checking across the entire application
- **vite**: Build tool with hot module replacement and optimized bundling
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database migration and schema management tools

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for form integration
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod for database schema validation

### Additional Features
- **date-fns**: Modern JavaScript date utility library for timestamp handling
- **cmdk**: Command palette component for enhanced navigation
- **embla-carousel-react**: Touch-friendly carousel component for image galleries
- **lucide-react**: Beautiful and consistent icon library for UI elements