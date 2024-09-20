# Chat Application

This project is a real-time chat application built with Laravel 11, Reverb package, and React. Users can message each other, view chat history, and receive new messages in real-time.

## Features

- User registration and authentication
- Real-time messaging (Reverb)
- Laravel and React integration

## Requirements

- PHP 8.2 or higher
- Node.js and npm
- Composer
- MySQL

## Installation

### 1. Laravel Setup

Navigate to the project directory and install the Laravel dependencies:

```bash
composer install
```
Copy the .env.example file to .env and configure your environment:

```bash
cp .env.example .env
```
Configure the database connection in the .env file:

```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=port
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```
### 2. Reverb

Reverb configuration

```bash
REVERB_APP_ID=id
REVERB_APP_KEY=key
REVERB_APP_SECRET=secret
REVERB_HOST="0.0.0.0"
REVERB_PORT=8080
REVERB_SCHEME=http
```
Start reverb
```bash
php artisan reverb:start
```

### 3. Queue

```bash
QUEUE_CONNECTION=sync
```
Start the queue worker
```bash
php artisan queue:work
```

### 4. React Setup

```bash
npm install
npm run dev
```

vite.config.js configuration

```javascript
server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
        host: 'yourhost.test',
        protocol: 'ws',
    },
}

