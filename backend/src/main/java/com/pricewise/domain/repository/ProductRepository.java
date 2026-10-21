package com.pricewise.domain.repository;

import com.pricewise.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p WHERE " +
           "(CAST(:q AS string) IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))) AND " +
           "(CAST(:brand AS string) IS NULL OR LOWER(p.brand) = LOWER(CAST(:brand AS string))) AND " +
           "(CAST(:category AS string) IS NULL OR LOWER(p.category) = LOWER(CAST(:category AS string)))")
    Page<Product> searchProducts(
            @Param("q") String q,
            @Param("brand") String brand,
            @Param("category") String category,
            Pageable pageable
    );

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category ASC")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE (CAST(:category AS string) IS NULL OR LOWER(p.category) = LOWER(CAST(:category AS string))) AND p.brand IS NOT NULL ORDER BY p.brand ASC")
    List<String> findDistinctBrands(@Param("category") String category);

    List<Product> findByCategoryIgnoreCase(String category);

    Optional<Product> findByModelNumber(String modelNumber);
}
