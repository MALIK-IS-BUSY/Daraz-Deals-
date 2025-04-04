# Daraz E-commerce Clone

This is a simple e-commerce platform based on Daraz. It includes an admin panel for product management and a user-facing storefront.

## Features

- Product listing and details
- Admin panel for product management
- Category filtering
- Search functionality
- Responsive design

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

## How to Run

There are three ways to run the application:

### 1. Start everything with one command (recommended)

This will start both the backend server and frontend development server:

```
npm run start
```

Then access the application at: http://localhost:3001

### 2. Start backend and frontend separately

Start the backend server:
```
npm run server
```

In a separate terminal, start the frontend:
```
npm run dev
```

### 3. Production build

Build the frontend:
```
npm run build
```

Start the backend and serve the built frontend:
```
npm run server
```

## Important Notes

- The backend uses a file-based JSON storage system that persists data even when the server restarts.
- The data is stored in `backend/products.json`.
- If the backend cannot be reached, the frontend will fall back to using localStorage, and then to using mock data as a last resort.

## Technology Stack

- React (Frontend)
- Express.js (Backend)
- File-based JSON storage (Database)
- Styled Components (Styling)
- React Router (Routing) 