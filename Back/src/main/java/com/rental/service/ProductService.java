package com.rental.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rental.dto.ProductDTO;
import com.rental.dto.ReviewDTO;
import com.rental.mapper.ProductMapper;

@Service
public class ProductService {

  private final ProductMapper mapper;

  @Autowired
	public ProductService(ProductMapper mapper) {
		this.mapper = mapper;
	}

	public List<ProductDTO> selectProducts(Map<String, Object> params) {
        return mapper.selectProducts(params);
    }

    public int addReview(ReviewDTO reviewDTO) {
      return mapper.insertReview(reviewDTO);
  }
}
