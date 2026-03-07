package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UrlDto {

    // ── Request ────────────────────────────────────────────────────────────

    public static class CreateRequest {

        @NotBlank(message = "URL must not be blank")
        @Pattern(
            regexp = "^(https?://)([\\w\\-]+(\\.[\\w\\-]+)+)(:[0-9]+)?(/[^\\s]*)?$",
            message = "Please provide a valid URL starting with http:// or https://"
        )
        private String originalUrl;

        @Pattern(
            regexp = "^[a-zA-Z0-9\\-]{3,20}$",
            message = "Custom alias must be 3-20 alphanumeric characters or hyphens"
        )
        private String customAlias;

        public CreateRequest() {}

        public String getOriginalUrl()           { return originalUrl; }
        public void setOriginalUrl(String v)     { this.originalUrl = v; }

        public String getCustomAlias()           { return customAlias; }
        public void setCustomAlias(String v)     { this.customAlias = v; }
    }

    // ── Responses ──────────────────────────────────────────────────────────

    public static class CreateResponse {
        private String shortUrl;
        private String originalUrl;
        private String shortCode;

        public CreateResponse() {}

        public CreateResponse(String shortUrl, String originalUrl, String shortCode) {
            this.shortUrl    = shortUrl;
            this.originalUrl = originalUrl;
            this.shortCode   = shortCode;
        }

        public String getShortUrl()              { return shortUrl; }
        public void setShortUrl(String v)        { this.shortUrl = v; }

        public String getOriginalUrl()           { return originalUrl; }
        public void setOriginalUrl(String v)     { this.originalUrl = v; }

        public String getShortCode()             { return shortCode; }
        public void setShortCode(String v)       { this.shortCode = v; }
    }

    public static class StatsResponse {
        private String originalUrl;
        private String shortCode;
        private String shortUrl;
        private Long clickCount;
        private String createdAt;
        private String updatedAt;

        public StatsResponse() {}

        public StatsResponse(String originalUrl, String shortCode, String shortUrl,
                             Long clickCount, String createdAt, String updatedAt) {
            this.originalUrl = originalUrl;
            this.shortCode   = shortCode;
            this.shortUrl    = shortUrl;
            this.clickCount  = clickCount;
            this.createdAt   = createdAt;
            this.updatedAt   = updatedAt;
        }

        public String getOriginalUrl()           { return originalUrl; }
        public void setOriginalUrl(String v)     { this.originalUrl = v; }

        public String getShortCode()             { return shortCode; }
        public void setShortCode(String v)       { this.shortCode = v; }

        public String getShortUrl()              { return shortUrl; }
        public void setShortUrl(String v)        { this.shortUrl = v; }

        public Long getClickCount()              { return clickCount; }
        public void setClickCount(Long v)        { this.clickCount = v; }

        public String getCreatedAt()             { return createdAt; }
        public void setCreatedAt(String v)       { this.createdAt = v; }

        public String getUpdatedAt()             { return updatedAt; }
        public void setUpdatedAt(String v)       { this.updatedAt = v; }
    }

    public static class ErrorResponse {
        private int status;
        private String error;
        private String message;
        private String timestamp;

        public ErrorResponse() {}

        public ErrorResponse(int status, String error, String message, String timestamp) {
            this.status    = status;
            this.error     = error;
            this.message   = message;
            this.timestamp = timestamp;
        }

        public int getStatus()                   { return status; }
        public void setStatus(int v)             { this.status = v; }

        public String getError()                 { return error; }
        public void setError(String v)           { this.error = v; }

        public String getMessage()               { return message; }
        public void setMessage(String v)         { this.message = v; }

        public String getTimestamp()             { return timestamp; }
        public void setTimestamp(String v)       { this.timestamp = v; }
    }
}
