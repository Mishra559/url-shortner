package com.urlshortener.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "urls", indexes = {
    @Index(name = "idx_short_code", columnList = "short_code", unique = true)
})
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_url", nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    @Column(name = "short_code", nullable = false, unique = true, length = 20)
    private String shortCode;

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Lifecycle ──────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Constructors ───────────────────────────────────────────────────────

    public Url() {}

    private Url(Builder b) {
        this.originalUrl = b.originalUrl;
        this.shortCode   = b.shortCode;
        this.clickCount  = b.clickCount;
    }

    // ── Builder ────────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String originalUrl;
        private String shortCode;
        private Long clickCount = 0L;

        public Builder originalUrl(String v)  { this.originalUrl = v; return this; }
        public Builder shortCode(String v)    { this.shortCode   = v; return this; }
        public Builder clickCount(Long v)     { this.clickCount  = v; return this; }
        public Url build()                    { return new Url(this); }
    }

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }

    public String getOriginalUrl()               { return originalUrl; }
    public void setOriginalUrl(String v)         { this.originalUrl = v; }

    public String getShortCode()                 { return shortCode; }
    public void setShortCode(String v)           { this.shortCode = v; }

    public Long getClickCount()                  { return clickCount; }
    public void setClickCount(Long v)            { this.clickCount = v; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }

    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)    { this.updatedAt = v; }
}
