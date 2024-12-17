package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.UserDetailDTO;

public interface UserRepositoryCustom {
    public UserDetailDTO getUserDetailById(ObjectId id);
}
