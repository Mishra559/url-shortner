package com.urlshortener.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Generates unique short codes using Base62 encoding.
 * Alphabet: [0-9][A-Z][a-z] → 62 characters
 * 6-char code → 62^6 = ~56 billion combinations
 */
@Component
public class ShortCodeGenerator {

    private static final String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.short-code-length:6}")
    private int codeLength;

    /** Generate a random Base62 short code. */
    public String generate() {
        StringBuilder sb = new StringBuilder(codeLength);
        for (int i = 0; i < codeLength; i++) {
            sb.append(BASE62.charAt(RANDOM.nextInt(BASE62.length())));
        }
        return sb.toString();
    }

    /** Encode a numeric ID to Base62 (deterministic). */
    public String encodeBase62(long id) {
        if (id == 0) return "000000";
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.insert(0, BASE62.charAt((int) (id % 62)));
            id /= 62;
        }
        while (sb.length() < codeLength) {
            sb.insert(0, '0');
        }
        return sb.toString();
    }
}
