package com.example.f1.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI().info(
                new Info().title("F1 Telemetry API")
                          .description("API for F1 telemetry from MongoDB")
                          .version("1.0")
        );
    }
}
