package com.umc.study.repository;

import com.umc.study.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // JpaRepository를 상속받으면 findById()는 별도 작성 없이 자동으로 제공됩니다.
}