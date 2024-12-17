package vn.edu.iuh.sv.vcarbe.repository;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.Review;
import vn.edu.iuh.sv.vcarbe.repository.custom.ReviewRepositoryCustom;

public interface ReviewRepository extends MongoRepository<Review, ObjectId>, ReviewRepositoryCustom {
}
