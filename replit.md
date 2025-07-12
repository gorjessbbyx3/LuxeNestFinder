# Hawaii Luxury Real Estate Platform - Replit Configuration

## Overview

This is a comprehensive luxury real estate platform specifically designed for Hawaii properties. The application combines cutting-edge AI technology with immersive user experiences, featuring 3D virtual tours, AI-powered property matching, and lifestyle-based recommendations. The platform integrates with Hawaii MLS data sources and provides both public property browsing and agent tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth, luxury-feel animations
- **Theme**: Custom luxury design system with dark/light mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript throughout the stack
- **API Design**: RESTful API with clear endpoint structure
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI GPT-4o for property descriptions and lifestyle matching

### Development Environment
- **Package Manager**: npm with package-lock.json for dependency locking
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Development Server**: Hot reload with Vite middleware integration
- **TypeScript**: Strict configuration with path mapping for clean imports

## Key Components

### AI-Powered Features
- **Lifestyle Matching Engine**: Scores properties based on user preferences beyond just specifications
- **AI Property Description Generator**: Creates compelling, SEO-optimized property descriptions
- **Smart Chat Assistant**: 24/7 AI concierge for property inquiries and guidance
- **Investment Analysis**: AI-powered ROI and market value scoring

### Immersive Media Experience
- **3D Virtual Tours**: Integration with Matterport/Cupix for interactive property exploration
- **AR Capabilities**: Planned augmented reality features for property visualization
- **High-Resolution Media Pipeline**: Automated image processing and optimization
- **Interactive Map Search**: Advanced filtering with overlay systems

### User Experience Components
- **Property Search**: AI-powered search with lifestyle filters
- **Lead Capture System**: Comprehensive form system for prospect management
- **Property Comparison Tool**: Side-by-side property analysis
- **Floating Action Menu**: Quick access to key features
- **Responsive Design**: Mobile-first approach with touch-optimized interactions

### Core Data Models
- **Properties**: Comprehensive property data with AI scoring metrics
- **Neighborhoods**: Community insights with safety, school, and lifestyle ratings
- **Leads**: Prospect management with lifecycle tracking
- **Property Inquiries**: Structured inquiry and follow-up system
- **Chat Conversations**: AI chat history and context management

## Data Flow

### Property Data Pipeline
1. **Data Ingestion**: Hawaii MLS integration for real-time property data
2. **AI Enhancement**: Automatic generation of lifestyle scores and descriptions
3. **Media Processing**: Image optimization and virtual tour integration
4. **Search Indexing**: Preparation for AI-powered search and matching

### User Interaction Flow
1. **Discovery**: AI-powered search and lifestyle matching
2. **Exploration**: Virtual tours and detailed property analysis
3. **Engagement**: Lead capture and inquiry management
4. **Follow-up**: AI chat assistance and automated nurturing

### Data Storage Strategy
- **PostgreSQL Tables**: Properties, neighborhoods, leads, inquiries, conversations
- **JSON Fields**: Flexible storage for images, amenities, and AI scores
- **Decimal Precision**: Financial data with appropriate precision
- **Timestamp Tracking**: Created/updated timestamps for audit trails

## External Dependencies

### AI and Machine Learning
- **OpenAI**: GPT-4o for natural language processing and generation
- **Planned Vector DB**: For advanced similarity matching (Pinecone or pgvector)

### Real Estate Data Sources
- **Hawaii MLS**: Primary property data source
- **Hawaii Information Service (HIS)**: Multi-island MLS coverage
- **Public Records**: Tax assessments and property ownership data
- **GIS Data**: Hawaii State GIS portal for boundaries and zoning

### Media and Content Delivery
- **Image Optimization**: WebP conversion and responsive sizing
- **CDN Integration**: Planned for high-performance media delivery
- **Virtual Tour Platforms**: Matterport and Cupix integration

### UI and Experience Libraries
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation and gesture library
- **Lucide React**: Modern icon library
- **React Hook Form**: Form state management with validation

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server and hot reload
- **Production**: Optimized builds with static asset generation
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Environment Variables**: Secure configuration for API keys and database URLs

### Build Process
- **Client Build**: Vite optimization with code splitting and asset hashing
- **Server Build**: esbuild bundling for Node.js deployment
- **Static Assets**: Served from dist/public directory
- **Database Migrations**: Drizzle Kit for schema management

### Scalability Considerations
- **Database**: PostgreSQL with connection pooling for concurrent users
- **API**: Express.js with efficient query patterns
- **Frontend**: Code splitting and lazy loading for optimal performance
- **Caching**: Query caching with TanStack Query for reduced server load

### Monitoring and Performance
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Logging**: Request/response logging with performance metrics
- **Database Optimization**: Proper indexing and query optimization
- **Asset Optimization**: Image compression and lazy loading

The application is designed to handle the unique requirements of Hawaiian luxury real estate, with special attention to visual presentation, AI-driven insights, and seamless user experiences that reflect the premium nature of the properties being showcased.