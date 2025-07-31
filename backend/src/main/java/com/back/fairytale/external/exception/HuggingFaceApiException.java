package com.back.fairytale.external.exception;

public class HuggingFaceApiException extends RuntimeException{
    public HuggingFaceApiException(String message) {
        super(message);
    }

    public HuggingFaceApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
