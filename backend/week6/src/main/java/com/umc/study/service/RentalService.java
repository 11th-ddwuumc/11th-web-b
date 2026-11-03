package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public int createRental(Map<String, Object> rental) {
        return rentalRepository.save(rental);
    }

    public int returnRental(Long rentalId) {
        return rentalRepository.returnBook(rentalId);
    }
}