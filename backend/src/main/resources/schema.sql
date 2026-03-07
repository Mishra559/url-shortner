-- ============================================================
-- URL Shortener Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS url_shortener
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE url_shortener;

-- ============================================================
-- Table: urls
-- ============================================================
CREATE TABLE IF NOT EXISTS urls (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    original_url TEXT           NOT NULL,
    short_code  VARCHAR(20)     NOT NULL,
    click_count BIGINT          NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_urls          PRIMARY KEY (id),
    CONSTRAINT uq_short_code    UNIQUE KEY (short_code)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores original URLs and their corresponding short codes';

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX idx_short_code     ON urls (short_code);
CREATE INDEX idx_original_url   ON urls ((SUBSTRING(original_url, 1, 255)));
CREATE INDEX idx_created_at     ON urls (created_at);

-- ============================================================
-- Sample Data (optional)
-- ============================================================
INSERT INTO urls (original_url, short_code, click_count) VALUES
    ('https://www.example.com/some/very/long/url/that/needs/shortening', 'abc123', 42),
    ('https://github.com/spring-projects/spring-boot', 'gh-boot', 17),
    ('https://docs.spring.io/spring-framework/reference/', 'spring', 5);
