package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.CarReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.LesseeReviewDTO;
import vn.edu.iuh.sv.vcarbe.dto.ReviewRequest;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.entity.ReviewType;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.ReviewRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.ReviewService;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private RentalContractRepository rentalContractRepository;

    @Override
    public Review addReview(UserPrincipal userPrincipal, ReviewRequest reviewRequest) {
        RentalContract rentalContract = rentalContractRepository.findById(reviewRequest.getRentalContractId())
                .orElseThrow(() -> new AppException(404, MessageKeys.CONTRACT_NOT_FOUND.name()));
        Review review = new Review();
        review.setRentalContractId(reviewRequest.getRentalContractId());
        review.setCarId(rentalContract.getCarId());
        review.setLesseeId(rentalContract.getLesseeId());
        review.setLessorId(rentalContract.getLessorId());
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        if (userPrincipal.getId().equals(rentalContract.getLessorId())) {
            review.setReviewType(ReviewType.LESSEE_REVIEW);
        } else if (userPrincipal.getId().equals(rentalContract.getLesseeId())) {
            review.setReviewType(ReviewType.CAR_REVIEW);
        } else {
            throw new AppException(403, MessageKeys.USER_NOT_AUTHORIZED.name());
        }

        return reviewRepository.save(review);
    }

    @Override
    public List<CarReviewDTO> getReviewsByCarId(ObjectId carId) {
        return reviewRepository.findCarReviewsWithUserDetailsByCarId(carId);
    }

    @Override
    public List<LesseeReviewDTO> getReviewsByLesseeId(ObjectId lesseeId) {
        return reviewRepository.findLesseeReviewsWithUserDetailsByLesseeId(lesseeId);
    }
}
