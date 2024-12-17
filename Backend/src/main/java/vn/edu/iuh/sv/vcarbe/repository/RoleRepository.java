package vn.edu.iuh.sv.vcarbe.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import vn.edu.iuh.sv.vcarbe.entity.Role;

public interface RoleRepository extends MongoRepository<Role, ObjectId> {
    Role findByName(String name);
}
