# snip. — URL Shortener MVP

A production-ready, full-stack URL shortener built with **Spring Boot 3**, **React 18**, **MySQL**, and **Redis**.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Design](#database-design)
5. [API Reference](#api-reference)
6. [Running Locally (Manual)](#running-locally-manual)
7. [Running with Docker](#running-with-docker)
8. [Postman Collection](#postman-collection)
9. [Deployment — Render](#deployment--render)
10. [Deployment — AWS](#deployment--aws-elastic-beanstalk)

---

## Features

| Feature | Status |
|---|---|
| Create short URL | ✅ |
| Redirect to original URL | ✅ |
| Click count tracking | ✅ |
| URL statistics endpoint | ✅ |
| Custom alias support | ✅ |
| Redis caching | ✅ |
| QR code generation | ✅ |
| Copy to clipboard | ✅ |
| URL validation | ✅ |
| Docker Compose setup | ✅ |

---

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2** — Web, JPA, Validation, Cache
- **MySQL 8.0** — Primary database
- **Redis 7** — Optional response caching
- **Maven** — Build tool
- **Lombok** — Boilerplate reduction

### Frontend
- **React 18** with Vite
- **TailwindCSS 3**
- **Axios** — HTTP client
- **React Router 6**
- **qrcode.react** — QR code generation
- **react-hot-toast** — Notifications

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── src/main/java/com/urlshortener/
│   │   ├── UrlShortenerApplication.java
│   │   ├── controller/
│   │   │   └── UrlController.java
│   │   ├── service/
│   │   │   └── UrlService.java
│   │   ├── repository/
│   │   │   └── UrlRepository.java
│   │   ├── entity/
│   │   │   └── Url.java
│   │   ├── dto/
│   │   │   └── UrlDto.java
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── UrlNotFoundException.java
│   │   │   └── ShortCodeAlreadyExistsException.java
│   │   └── config/
│   │       ├── ShortCodeGenerator.java
│   │       ├── CorsConfig.java
│   │       └── RedisConfig.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-docker.properties
│   │   └── schema.sql
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── UrlForm.jsx
│   │   │   ├── UrlResult.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docker-compose.yml
└── README.md
```

---

## Database Design

```sql
CREATE TABLE urls (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    original_url TEXT        NOT NULL,
    short_code  VARCHAR(20) NOT NULL UNIQUE,
    click_count BIGINT      NOT NULL DEFAULT 0,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_short_code (short_code),
    INDEX idx_short_code (short_code),
    INDEX idx_created_at (created_at)
);
```

### Short Code Generation

Uses **Base62 encoding** over a 62-character alphabet (`[0-9A-Za-z]`).
- 6-character codes → 62⁶ ≈ **56 billion** unique combinations
- `SecureRandom` for cryptographic randomness
- Collision retry loop (max 5 attempts)
- Custom alias option (3–20 chars, alphanumeric + hyphens)

---

## API Reference

### POST `/api/urls` — Create short URL

**Request:**
```json
{
  "originalUrl": "https://example.com/very/long/path",
  "customAlias": "my-link"   // optional
}
```

**Response `201 Created`:**
```json
{
  "shortUrl": "http://localhost:8080/my-link",
  "originalUrl": "https://example.com/very/long/path",
  "shortCode": "my-link"
}
```

---

### GET `/{shortCode}` — Redirect

Redirects to the original URL with **HTTP 302** and increments click counter.

```
GET http://localhost:8080/abc123
→ 302 Location: https://example.com/very/long/path
```

---

### GET `/api/urls/{shortCode}` — Statistics

**Response `200 OK`:**
```json
{
  "originalUrl": "https://example.com/very/long/path",
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/abc123",
  "clickCount": 42,
  "createdAt": "2024-01-15 10:30:00",
  "updatedAt": "2024-01-20 14:22:11"
}
```

---

### GET `/api/health` — Health check

```json
{ "status": "UP", "service": "url-shortener" }
```

---

### Error Responses

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Short URL not found for code: xyz999",
  "timestamp": "2024-01-15T10:30:00"
}
```

| Code | Meaning |
|------|---------|
| 400 | Validation failed (invalid URL format) |
| 404 | Short code not found |
| 409 | Custom alias already in use |
| 500 | Internal server error |

---

## Running Locally (Manual)

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+
- Redis (optional — disable cache in properties if not available)

### 1. Setup MySQL

```sql
CREATE DATABASE url_shortener CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'apppassword';
GRANT ALL PRIVILEGES ON url_shortener.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Backend

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=appuser
spring.datasource.password=apppassword
app.base-url=http://localhost:8080
```

To **disable Redis** (run without it):
```properties
spring.cache.type=simple
```

### 3. Start Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend available at: `http://localhost:8080`

### 4. Start Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Edit if needed
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## Running with Docker

The easiest way to run everything — MySQL + Redis + Backend + Frontend.

### Start all services

```bash
# From project root
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8080 |
| MySQL    | localhost:3306 |
| Redis    | localhost:6379 |

### Stop all services

```bash
docker compose down
```

### Rebuild after code changes

```bash
docker compose up --build --force-recreate
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Postman Collection

Import the following requests into Postman:

### Create Short URL
```
POST http://localhost:8080/api/urls
Content-Type: application/json

{
  "originalUrl": "https://www.example.com/very/long/url/that/needs/shortening"
}
```

### Create with Custom Alias
```
POST http://localhost:8080/api/urls
Content-Type: application/json

{
  "originalUrl": "https://github.com/spring-projects/spring-boot",
  "customAlias": "spring-gh"
}
```

### Get Stats
```
GET http://localhost:8080/api/urls/abc123
```

### Redirect (open in browser)
```
GET http://localhost:8080/abc123
```

### Health Check
```
GET http://localhost:8080/api/health
```

---

## Deployment — Render

[Render](https://render.com) is the simplest free hosting option.

### Deploy Backend (Web Service)

1. Push code to GitHub
2. In Render dashboard → **New → Web Service**
3. Connect your GitHub repo, select `backend/` as root
4. Set:
   - **Runtime:** Docker
   - **Dockerfile Path:** `./backend/Dockerfile`
5. Add environment variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<your-render-mysql-host>:3306/url_shortener
   SPRING_DATASOURCE_USERNAME=<user>
   SPRING_DATASOURCE_PASSWORD=<password>
   SPRING_DATA_REDIS_HOST=<your-redis-host>
   APP_BASE_URL=https://your-app.onrender.com
   ```
6. **Create Web Service**

### Deploy MySQL on Render

1. New → **PostgreSQL** (or use PlanetScale for MySQL)
2. Copy the connection string to backend env vars

### Deploy Frontend (Static Site)

1. New → **Static Site**
2. Root directory: `frontend/`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

## Deployment — AWS Elastic Beanstalk

### Backend

1. Package the JAR:
   ```bash
   cd backend && mvn clean package -DskipTests
   ```

2. Create an Elastic Beanstalk application:
   ```bash
   eb init url-shortener-backend --platform java-17 --region us-east-1
   eb create url-shortener-prod
   ```

3. Set environment variables via EB console or CLI:
   ```bash
   eb setenv \
     SPRING_DATASOURCE_URL="jdbc:mysql://your-rds-endpoint:3306/url_shortener" \
     SPRING_DATASOURCE_USERNAME="admin" \
     SPRING_DATASOURCE_PASSWORD="yourpassword" \
     APP_BASE_URL="http://your-eb-env.elasticbeanstalk.com"
   ```

4. Deploy:
   ```bash
   eb deploy
   ```

### RDS MySQL Setup (AWS)

```bash
aws rds create-db-instance \
  --db-instance-identifier url-shortener-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password yourpassword \
  --allocated-storage 20 \
  --publicly-accessible
```

### Frontend to S3 + CloudFront

```bash
cd frontend
npm run build

# Upload dist/ to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Configuration Reference

| Property | Default | Description |
|---|---|---|
| `app.base-url` | `http://localhost:8080` | Base URL prepended to short codes |
| `app.short-code-length` | `6` | Length of generated short codes |
| `spring.cache.type` | `redis` | Cache backend (`redis` or `simple`) |
| `spring.data.redis.host` | `localhost` | Redis host |
| `spring.data.redis.port` | `6379` | Redis port |

---

## License

MIT
