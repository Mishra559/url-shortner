package com.urlshortener.service;

import com.urlshortener.config.ShortCodeGenerator;
import com.urlshortener.dto.UrlDto;
import com.urlshortener.entity.Url;
import com.urlshortener.exception.ShortCodeAlreadyExistsException;
import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.repository.UrlRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class UrlService {

    private static final Logger log = LoggerFactory.getLogger(UrlService.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final int MAX_RETRIES = 5;

    private final UrlRepository urlRepository;
    private final ShortCodeGenerator codeGenerator;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public UrlService(UrlRepository urlRepository, ShortCodeGenerator codeGenerator) {
        this.urlRepository  = urlRepository;
        this.codeGenerator  = codeGenerator;
    }

    // ── Create ─────────────────────────────────────────────────────────────

    @Transactional
    public UrlDto.CreateResponse createShortUrl(UrlDto.CreateRequest request) {
        String originalUrl  = request.getOriginalUrl();
        String customAlias  = request.getCustomAlias();

        // Return existing mapping when no custom alias is requested
        if (customAlias == null || customAlias.isBlank()) {
            Optional<Url> existing = urlRepository.findByOriginalUrl(originalUrl);
            if (existing.isPresent()) {
                log.info("Returning existing short code for URL: {}", originalUrl);
                return toCreateResponse(existing.get());
            }
        }

        String shortCode = resolveShortCode(request);

        Url url = Url.builder()
            .originalUrl(originalUrl)
            .shortCode(shortCode)
            .clickCount(0L)
            .build();

        Url saved = urlRepository.save(url);
        log.info("Created short URL: {} -> {}", shortCode, originalUrl);
        return toCreateResponse(saved);
    }

    private String resolveShortCode(UrlDto.CreateRequest request) {
        String customAlias = request.getCustomAlias();

        if (customAlias != null && !customAlias.isBlank()) {
            String alias = customAlias.trim();
            if (urlRepository.existsByShortCode(alias)) {
                throw new ShortCodeAlreadyExistsException(alias);
            }
            return alias;
        }

        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            String code = codeGenerator.generate();
            if (!urlRepository.existsByShortCode(code)) {
                return code;
            }
            log.warn("Short code collision on attempt {}: {}", attempt + 1, code);
        }
        throw new RuntimeException("Failed to generate unique short code after " + MAX_RETRIES + " attempts");
    }

    // ── Redirect + Click Track ─────────────────────────────────────────────

    @Transactional
    @CacheEvict(value = "url-stats", key = "#shortCode")
    public String getOriginalUrlAndTrack(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
            .orElseThrow(() -> new UrlNotFoundException(shortCode));

        urlRepository.incrementClickCount(shortCode);
        log.info("Redirect: {} -> {} (click #{})", shortCode, url.getOriginalUrl(), url.getClickCount() + 1);
        return url.getOriginalUrl();
    }

    // ── Stats ──────────────────────────────────────────────────────────────

    @Cacheable(value = "url-stats", key = "#shortCode")
    @Transactional(readOnly = true)
    public UrlDto.StatsResponse getStats(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
            .orElseThrow(() -> new UrlNotFoundException(shortCode));

        return new UrlDto.StatsResponse(
            url.getOriginalUrl(),
            url.getShortCode(),
            baseUrl + "/" + url.getShortCode(),
            url.getClickCount(),
            url.getCreatedAt().format(FORMATTER),
            url.getUpdatedAt().format(FORMATTER)
        );
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private UrlDto.CreateResponse toCreateResponse(Url url) {
        return new UrlDto.CreateResponse(
            baseUrl + "/" + url.getShortCode(),
            url.getOriginalUrl(),
            url.getShortCode()
        );
    }
}
