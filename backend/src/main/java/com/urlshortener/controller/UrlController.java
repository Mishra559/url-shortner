package com.urlshortener.controller;

import com.urlshortener.dto.UrlDto;
import com.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
public class UrlController {

    private static final Logger log = LoggerFactory.getLogger(UrlController.class);

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    /** POST /api/urls — Create a new short URL. */
    @PostMapping("/api/urls")
    public ResponseEntity<UrlDto.CreateResponse> createShortUrl(
            @Valid @RequestBody UrlDto.CreateRequest request) {
        UrlDto.CreateResponse response = urlService.createShortUrl(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** GET /{shortCode} — Redirect to original URL and track click. */
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        String originalUrl = urlService.getOriginalUrlAndTrack(shortCode);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(originalUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /** GET /api/urls/{shortCode} — Get statistics for a short URL. */
    @GetMapping("/api/urls/{shortCode}")
    public ResponseEntity<UrlDto.StatsResponse> getStats(@PathVariable String shortCode) {
        UrlDto.StatsResponse stats = urlService.getStats(shortCode);
        return ResponseEntity.ok(stats);
    }

    /** GET /api/health — Health check. */
    @GetMapping("/api/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\": \"UP\", \"service\": \"url-shortener\"}");
    }
}
