> [!WARNING]
> proceeding to finish front-end

<img width="1866" height="3523" alt="pasted file" src="https://github.com/user-attachments/assets/0b407ab0-7782-4195-889f-b44b5437123a" />
<img width="443" height="511" alt="image" src="https://github.com/user-attachments/assets/697cd4c7-be9c-4a55-9fd0-f28f1283ef6f" />
<img width="412" height="591" alt="image" src="https://github.com/user-attachments/assets/087539e9-5ae3-4eb4-b2bd-98b1388e6ca0" />



# VeriVerdad

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=000000)

A gamified media literacy platform designed for the UNESCO Hackathon 2026,<br> empowering students to think critically and verify information in the digital age.

<br>

## How to Setup Locally

### Installation

Clones the repository directly to your local machine.
```bash
git clone https://github.com/zamuwelle/VeriVerdad.git my-app
cd my-app
```

### Backend

<details>
<summary><strong>Windows</strong></summary>

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
type nul > database\database.sqlite

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

</details>

<details>
<summary><strong>Unix (Linux/macOS)</strong></summary>

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Create SQLite database
touch database/database.sqlite

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

</details>

### Frontend

<details>
<summary><strong>Windows</strong></summary>

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Start development server
npm run dev
```

</details>

<details>
<summary><strong>Unix (Linux/macOS)</strong></summary>

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

</details>

## Environment Variables

### Backend (.env)

```env
SECRET_TOKEN=your-secret-token-here
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_SECRET_TOKEN=your-secret-token-here
```

> **Note:** The `SECRET_TOKEN` value in your backend `.env` file must match the `VITE_SECRET_TOKEN` value in your frontend `.env` file. This token is required for authenticating API requests from your frontend application. Update `VITE_API_URL` if your backend runs on a different address.
