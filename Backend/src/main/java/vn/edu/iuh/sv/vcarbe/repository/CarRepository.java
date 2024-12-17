package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.repository.custom.CarRepositoryCustom;

import java.util.Optional;

@Repository
public interface CarRepository extends MongoRepository<Car, ObjectId>, CarRepositoryCustom {
    Optional<Car> findByOwnerAndId(ObjectId owner, ObjectId id);

    Car deleteByIdAndOwner(ObjectId id, ObjectId owner);
}
