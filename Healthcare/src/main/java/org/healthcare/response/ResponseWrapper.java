package org.healthcare.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
public class ResponseWrapper<T> {
    private T data;
    private Meta meta;



    public static <T> ResponseWrapper<T> success(T data) {
        return new ResponseWrapper<>(data, new Meta(Instant.now().toString()));
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Meta {
        private String timestamp;
    }
}
