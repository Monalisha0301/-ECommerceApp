package com.example.EcommerceApp.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.example.EcommerceApp.entity.Product;
import com.example.EcommerceApp.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Add product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Delete product
    public String deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            return "Product not found";
        }

        productRepository.deleteById(id);

        return "Product deleted successfully";
    }

    // Get product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElse(null);
    }
}