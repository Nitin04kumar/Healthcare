package org.healthcare.service.impl;


import lombok.RequiredArgsConstructor;

import org.healthcare.service.CookieService;
import org.healthcare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CookieServiceImpl implements CookieService {

    private final JwtUtils jwtConfig;

    @Value("${security.cookie.secure}")
    private boolean secure;

    @Value("${security.cookie.same-site}")
    private String sameSite;

    /**
     * Creates an HttpOnly, Secure cookie for the JWT access token.
     * @param token The JWT access token.
     * @return A ResponseCookie object.
     */
    @Override
    public ResponseCookie createAccessTokenCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtConfig.getAccessToken().getExpirationMs()))
                .build();
    }

    /**
     * Creates an HttpOnly, Secure cookie for the refresh token.
     * HttpOnly is crucial here to prevent XSS attacks from stealing the refresh token.
     * @param token The refresh token.
     * @return A ResponseCookie object.
     */
    @Override
    public ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofMillis(jwtConfig.getRefreshToken().getExpirationMs()))
                .build();
    }

    /**
     * Creates an expired cookie to clear it from the browser.
     * @param name The name of the cookie to clear (e.g., "access_token").
     * @return An expired ResponseCookie object.
     */
    @Override
    public ResponseCookie createExpiredCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(0)
                .build();
    }
}
