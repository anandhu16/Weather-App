# Weather Application - Replit.md

## Overview

This is a responsive weather application built with React, Express, and TypeScript. The app provides current weather conditions, 5-day forecasts, geolocation support, and city search functionality using WeatherAPI.com as the data source.

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
- **Weather Integration**: WeatherAPI.com for real-time weather data
- **Storage**: In-memory caching for performance optimization

### Data Storage Layer
- **Storage**: In-memory caching system for weather data
- **Cache Duration**: 10 minutes for optimal performance
- **Schema Location**: `shared/schema.ts` for type sharing between client and server

## Key Components

### Weather Data Schema
The application manages weather-related data entities:
- **WeatherData**: Current weather conditions with location details
- **ForecastData**: 5-day weather forecast with hourly data
- **SearchResult**: City search results with coordinates
- **Caching**: In-memory storage for weather data (10-minute cache)

### API Endpoints
Core weather endpoints:
- `/api/weather/current` - Current weather by coordinates
- `/api/weather/city` - Weather data by city name search
- `/api/weather/forecast` - 5-day weather forecast
- `/api/weather/search` - City search with coordinates

### UI Components
- **Weather Cards**: Current conditions and forecast display
- **Search Bar**: City search with autocomplete
- **Location Services**: Geolocation support for current position
- **Responsive Design**: Mobile-first responsive layout

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks
2. **API Layer**: Express routes handle WeatherAPI.com integration
3. **Weather Service**: WeatherAPI.com provides real-time weather data
4. **Response Processing**: Data is transformed and cached in memory
5. **UI Updates**: React Query manages caching and real-time updates

## External Dependencies

### Production Dependencies
- **WeatherAPI.com**: Weather data provider (API key: configured)
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **lucide-react**: Icon library for weather icons
- **date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Weather API**: WeatherAPI.com with configured API key
- **Dev Server**: Vite with HMR and error overlay
- **Port Configuration**: Server on port 5000, proxied to port 80

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built React app in production
- **Weather API**: WeatherAPI.com integration with API key

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **WEATHER_API_KEY**: WeatherAPI.com API key (configured: 563f2884f5b84848a1a91323251606)
- **Replit Integration**: Cartographer plugin for development tooling

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 16, 2025. Initial setup