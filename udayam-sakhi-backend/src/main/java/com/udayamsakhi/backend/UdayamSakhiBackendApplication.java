package com.udayamsakhi.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UdayamSakhiBackendApplication {

    public static void main(String[] args) {

        String mongoUri = System.getenv("MONGODB_URI");

        if (mongoUri == null || mongoUri.isBlank()) {
            System.out.println(">>> MONGODB_URI = NOT SET");
        } else if (mongoUri.startsWith("mongodb+srv://")) {
            System.out.println(">>> MONGODB_URI = ATLAS_SRV");
        } else if (mongoUri.startsWith("mongodb://")) {
            System.out.println(">>> MONGODB_URI = MONGODB_STANDARD");
        } else {
            System.out.println(">>> MONGODB_URI = UNKNOWN_FORMAT");
        }

        SpringApplication.run(UdayamSakhiBackendApplication.class, args);
    }
}