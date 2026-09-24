package com.example.EcommerceApp.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.example.EcommerceApp.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}