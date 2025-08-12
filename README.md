# 🎬 Movie App

A modern, responsive React-based movie application that allows users to browse movies and TV shows, view details, search, and manage a personalized wishlist. Built with React 19, Vite, and TMDB API.

![Movie App Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Movie+App+Screenshot)

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Configuration](#-api-configuration)
- [Usage Guide](#-usage-guide)
- [Features Breakdown](#-features-breakdown)
- [Technical Implementation](#-technical-implementation)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

## ✨ Features

### 🎯 Core Features
- **📽️ Movies List Page** - Browse now playing movies with pagination
- **🎭 Movie Details** - View detailed information, reviews, and recommendations
- **❤️ Wishlist Management** - Add/remove movies and TV shows to wishlist
- **🔍 Search Functionality** - Search for movies and view results with pagination
- **📺 TV Shows** - Browse popular TV shows with details (Bonus Feature)
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🛠️ Technical Features
- **⚡ React Router** for seamless navigation
- **💾 Local Storage** for wishlist persistence
- **🌐 TMDB API Integration** using fetch API
- **🎨 Modern UI** with smooth animations and transitions
- **📊 Responsive Grid Layout** for optimal viewing
- **⏳ Loading States** and comprehensive error handling
- **🔢 Pagination** for movies and search results
- **🎯 Real-time Search** with URL state management

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI Framework |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Vite** | 7.0.4 | Build tool and dev server |
| **Lucide React** | Latest | Icon library |
| **TMDB API** | v3 | Movie and TV show data |
| **CSS3** | Latest | Styling with modern features |

## 📁 Project Structure

```
ITI-Final-Project/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with search and wishlist
│   │   └── MovieCard.jsx       # Reusable movie/TV show card component
│   ├── pages/
│   │   ├── MoviesList.jsx      # Main movies listing page with pagination
│   │   ├── MovieDetails.jsx    # Movie details with tabs (overview, reviews, recommendations)
│   │   ├── Wishlist.jsx        # Wishlist management with filtering
│   │   ├── SearchResults.jsx   # Search results page with pagination
│   │   ├── TVShows.jsx         # TV shows listing page
│   │   └── TVShowDetails.jsx   # TV show details page
│   ├── services/
│   │   └── api.js              # TMDB API service with error handling
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx                 # Main app component with routing and state management
│   ├── App.css                 # Comprehensive styling with responsive design
│   ├── index.css               # Global styles and CSS reset
│   └── main.jsx               # Application entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser

### Step 1: Clone or Download
```bash
# If you have the project files, navigate to the project directory
cd ITI-Final-Project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure API Key
1. Visit [The Movie Database (TMDB)](https://www.themoviedb.org/login)
2. Create an account and log in
3. Go to your account settings → API section
4. Request an API key for developer use
5. Copy your API key
6. Open `src/services/api.js`
7. Replace the API key:
```javascript
const API_KEY = 'your_actual_api_key_here';
```
