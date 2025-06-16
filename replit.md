# Supply Chain Management System - Replit.md

## Overview

This is a full-stack supply chain management application built with React, Express, and PostgreSQL. The system provides an executive dashboard for managing inventory, suppliers, orders, and analytics with real-time data visualization and reporting capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack React Query for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured error handling
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple

### Database Layer
- **Database**: PostgreSQL 16 (configured for Neon serverless in production)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema Location**: `shared/schema.ts` for type sharing between client and server

## Key Components

### Database Schema
The system manages five core entities:
- **Users**: Authentication and role-based access
- **Suppliers**: Vendor management with performance tracking
- **Products**: Inventory items with stock levels and thresholds
- **Orders**: Purchase order lifecycle management
- **Activities**: Audit trail and activity logging

### API Endpoints
Core dashboard endpoints:
- `/api/dashboard/kpis` - Key performance indicators
- `/api/dashboard/inventory-levels` - Time-series inventory data
- `/api/dashboard/suppliers` - Supplier status overview
- `/api/dashboard/activities` - Recent system activities

### UI Components
- **Layout System**: Responsive sidebar navigation with mobile support
- **Dashboard Widgets**: KPI cards, charts, and data tables
- **Data Visualization**: Recharts integration for inventory trends
- **Modal System**: Export functionality and form dialogs

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks
2. **API Layer**: Express routes handle business logic and data validation
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Processing**: Data is transformed and returned as JSON
5. **UI Updates**: React Query manages caching and real-time updates

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **recharts**: Charting library for data visualization
- **date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Dev Server**: Vite with HMR and error overlay
- **Port Configuration**: Server on port 5000, proxied to port 80

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built React app in production
- **Database**: Neon serverless PostgreSQL with connection pooling

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **DATABASE_URL**: PostgreSQL connection string (required)
- **Replit Integration**: Cartographer plugin for development tooling

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 16, 2025. Initial setup