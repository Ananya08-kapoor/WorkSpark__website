package com.workspark.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * The H2 console is reachable ONLY in the "dev" profile.
 * In "prod" it is disabled in application-prod.yml AND explicitly denied here.
 * Merge your existing rules (login, role-based matchers) into both chains.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    @Profile("dev")
    SecurityFilterChain devChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(a -> a
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated())
            .csrf(c -> c.ignoringRequestMatchers("/h2-console/**"))
            .headers(h -> h.frameOptions(f -> f.sameOrigin())); // H2 console uses frames
        return http.build();
    }

    @Bean
    @Profile("prod")
    SecurityFilterChain prodChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(a -> a
                .requestMatchers("/h2-console/**").denyAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated())
            .headers(h -> h.frameOptions(f -> f.deny()));
        return http.build();
    }
}
