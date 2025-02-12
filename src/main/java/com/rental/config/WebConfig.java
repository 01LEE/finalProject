package com.rental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    // 정적 리소스 핸들러 (로컬 디렉토리에서 이미지 제공)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 기존 C:/car-images 제공하는 핸들러 유지
        registry.addResourceHandler("/car-images/**")
                .addResourceLocations("file:C:/car-images/")
                .setCachePeriod(3600);
    
        // static 폴더의 이미지를 제공하는 핸들러 추가
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
    }
    

    // CORS 설정
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // 특정 Origin만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 필요한 메서드만 허용
                .allowCredentials(true); // withCredentials 허용
    }
}
