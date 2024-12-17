package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalRequest;

import java.util.Optional;

public interface RentalRequestRepository extends MongoRepository<RentalRequest, ObjectId> {
    Optional<RentalRequest> findByIdAndLessorId(ObjectId lesseeId, ObjectId lessorId);

    Page<RentalRequest> findByLessorIdAndStatus(ObjectId lessorId, RentRequestStatus status, Pageable pageable);

    Page<RentalRequest> findByLessorId(ObjectId id, Pageable pageable);

    Page<RentalRequest> findByLesseeIdAndStatus(ObjectId id, RentRequestStatus status, Pageable pageable);

    Page<RentalRequest> findByLesseeId(ObjectId id, Pageable pageable);
}
