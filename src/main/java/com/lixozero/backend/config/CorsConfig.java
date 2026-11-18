package com.lixozero.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(@Value("${app.cors.allowed-origins:*}") String origensStr) {
        List<String> origens = Arrays.stream(origensStr.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        // Validação de segurança: "*" não pode conviver com outras origens
        boolean hasWildcard = origens.contains("*");
        if (hasWildcard && origens.size() > 1) {
            throw new IllegalStateException(
                    "Configuração CORS inválida: '*' (todas as origens) não pode ser combinado com origens específicas. " +
                    "Use apenas '*' para desenvolvimento OU liste domínios específicos para produção."
            );
        }

        // Em produção (origens específicas), permite credenciais; em dev (*) não permite
        boolean allowCredentials = !hasWildcard;

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(origens.toArray(new String[0]))
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(allowCredentials)
                        .maxAge(3600); // Cache de preflight por 1 hora
            }
        };
    }
}
