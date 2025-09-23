package org.healthcare.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;

/**
 * A standardized, generic API response wrapper for the entire application.
 * It includes a 'success' flag, a payload ('data'), and error details.
 * The @JsonInclude annotation ensures that null fields (like 'data' in an error response,
 * or 'error' in a success response) are not included in the JSON output.
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String timestamp;
    private final T data;
    private final ErrorDetails error;

    // Private constructor for a successful response
    private ApiResponse(T data) {
        this.success = true;
        this.timestamp = Instant.now().toString();
        this.data = data;
        this.error = null;
    }

    // Private constructor for an error response
    private ApiResponse(int status, String message, String path) {
        this.success = false;
        this.timestamp = Instant.now().toString();
        this.data = null;
        this.error = new ErrorDetails(status, message, path);
    }

    /**
     * Static factory method to create a successful response.
     * @param data The payload to be included in the response.
     * @return An ApiResponse instance for a successful operation.
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data);
    }

    /**
     * Static factory method to create an error response.
     * @param status The HTTP status code.
     * @param message A descriptive error message.
     * @param path The request path where the error occurred.
     * @return An ApiResponse instance for a failed operation.
     */
    public static ApiResponse<?> error(int status, String message, String path) {
        return new ApiResponse<>(status, message, path);
    }

    /**
     * Inner class to hold structured error information.
     */
    @Getter
    private static class ErrorDetails {
        private final int status;
        private final String message;
        private final String path;

        ErrorDetails(int status, String message, String path) {
            this.status = status;
            this.message = message;
            this.path = path;
        }
    }
}