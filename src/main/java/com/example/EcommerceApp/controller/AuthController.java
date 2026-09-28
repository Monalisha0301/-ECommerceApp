package com.example.EcommerceApp.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.example.EcommerceApp.entity.User;
import com.example.EcommerceApp.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        return authService.register(user);
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody User user) {

        String token = authService.login(
                user.getUsername(),
                user.getPassword());

        return Map.of("token", token);
    }
}
