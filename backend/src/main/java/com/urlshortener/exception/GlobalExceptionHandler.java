package com.urlshortener.exception;

import com.urlshortener.dto.UrlDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UrlNotFoundException.class)
    public ResponseEntity<UrlDto.ErrorResponse> handleUrlNotFound(UrlNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new UrlDto.ErrorResponse(
                404,
                "Not Found",
                ex.getMessage(),
                LocalDateTime.now().toString()
            ));
    }

    @ExceptionHandler(ShortCodeAlreadyExistsException.class)
    public ResponseEntity<UrlDto.ErrorResponse> handleShortCodeConflict(ShortCodeAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new UrlDto.ErrorResponse(
                409,
                "Conflict",
                ex.getMessage(),
                LocalDateTime.now().toString()
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<UrlDto.ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining("; "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new UrlDto.ErrorResponse(
                400,
                "Validation Failed",
                message,
                LocalDateTime.now().toString()
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<UrlDto.ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new UrlDto.ErrorResponse(
                500,
                "Internal Server Error",
                "An unexpected error occurred.",
                LocalDateTime.now().toString()
            ));
    }
}
