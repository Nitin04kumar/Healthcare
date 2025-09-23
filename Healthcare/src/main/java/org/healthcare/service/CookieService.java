package org.healthcare.service;


import org.springframework.http.ResponseCookie;

public interface CookieService {
    ResponseCookie createAccessTokenCookie(String token);
    ResponseCookie createRefreshTokenCookie(String token);
    ResponseCookie createExpiredCookie(String name);
}
