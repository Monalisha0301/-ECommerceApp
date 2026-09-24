package com.example.EcommerceApp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.EcommerceApp.entity.Product;
import com.example.EcommerceApp.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {

        return productRepository.findAll();
    }

    @PostMapping
    public Product addProduct(
            @RequestBody Product product) {

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(
            @PathVariable Long id) {

        productRepository.deleteById(id);

        return "Product deleted successfully";
    }
}
