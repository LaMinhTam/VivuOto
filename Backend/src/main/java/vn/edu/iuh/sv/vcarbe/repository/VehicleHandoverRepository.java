package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;

import java.util.Optional;

public interface VehicleHandoverRepository extends MongoRepository<VehicleHandoverDocument, ObjectId> {
    Optional<VehicleHandoverDocument> findByRentalContractId(ObjectId rentalContractId);

    Optional<VehicleHandoverDocument> findByIdAndLesseeId(ObjectId rentalContractId, ObjectId lesseeId);

    Optional<VehicleHandoverDocument> findByIdAndLessorId(ObjectId rentalContractId, ObjectId lessorId);

    Page<VehicleHandoverDocument> findByLessorId(ObjectId id, Pageable pageable);

    Page<VehicleHandoverDocument> findByLesseeId(ObjectId id, Pageable pageable);
}
