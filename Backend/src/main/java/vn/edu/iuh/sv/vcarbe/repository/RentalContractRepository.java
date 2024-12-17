package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;

import java.util.Optional;

public interface RentalContractRepository extends MongoRepository<RentalContract, ObjectId> {
    Page<RentalContract> findByLessorId(ObjectId owner, Pageable pageable);
    Page<RentalContract> findByLesseeId(ObjectId lessee, Pageable pageable);
    Optional<RentalContract> findByLesseeIdAndId(ObjectId lessee, ObjectId id);
    Optional<RentalContract> findByLessorIdAndId(ObjectId lessor, ObjectId id);
    Optional<RentalContract> findByRentalRequestId(ObjectId rentalRequestId);
}
