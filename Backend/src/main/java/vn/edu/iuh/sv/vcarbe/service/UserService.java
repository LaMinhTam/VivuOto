package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.*;

public interface UserService {
    UserDTO updateUser(ObjectId userId, UpdateUserDTO updateUserDTO);

    UserDTO updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO);

    UserProfileDTO getUserById(ObjectId id);

    UserDTO updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO);

    UserDetailDTO getUserDetailById(ObjectId id);

    void addToken(ObjectId id, String address);

    void updateMetamaskAddress(ObjectId id, String address);
}
