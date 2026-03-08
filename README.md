# 🔗 URL Shortener

A full-stack URL shortening application built with **Spring Boot**, **React**, **MySQL**, and **Redis**.

The application allows users to convert long URLs into short links, redirect users to the original URL, and track click statistics.

---

## Features

- Create short URLs from long links
- Redirect short URLs to original URLs
- Click count tracking
- URL statistics endpoint
- Optional custom alias support
- Redis caching for faster redirects
- QR code generation
- Docker setup for easy deployment

---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- Redis (optional)
- Maven

### Frontend
- React
- TailwindCSS
- Axios

---

## Project Structure
url-shortener/
├── backend/
│ ├── controller/
│ ├── service/
│ ├── repository/
│ ├── entity/
│ ├── dto/
│ ├── exception/
│ └── config/
│
├── frontend/
│ ├── components/
│ ├── pages/
│ └── services/
│
├── docker-compose.yml
└── README.md


---

## Database Design

```sql
CREATE TABLE urls (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  click_count BIGINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

POST /api/urls

{
  "originalUrl": "https://example.com/very/long/path"
}

Response

{
  "shortUrl": "http://localhost:8080/abc123",
  "originalUrl": "https://example.com/very/long/path"
}


Running the Application
Start Backend
cd backend
mvn spring-boot:run

Backend will run on:

http://localhost:8080
Start Frontend
cd frontend
npm install
npm run dev
Frontend will run on:

http://localhost:3000

Running with Docker
docker compose up --build

Services:

Service	URL
Frontend	http://localhost:3000

Backend	http://localhost:8080

MySQL	localhost:3306
Redis	localhost:6379


Future Improvements

URL expiration

Analytics dashboard

Rate limiting

Link preview metadata

User authentication