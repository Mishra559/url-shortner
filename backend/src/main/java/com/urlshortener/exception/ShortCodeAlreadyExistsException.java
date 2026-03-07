package com.urlshortener.exception;

public class ShortCodeAlreadyExistsException extends RuntimeException {

    public ShortCodeAlreadyExistsException(String alias) {
        super("Custom alias '" + alias + "' is already in use. Please choose another.");
    }
}
