package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.CarLicense;
import vn.edu.iuh.sv.vcarbe.entity.CitizenIdentification;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.service.UserService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;

import java.math.BigDecimal;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BlockchainUtils blockchainUtils;

    private User getUserByIdFromRepository(ObjectId userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));
    }

    @Override
    public UserProfileDTO getUserById(ObjectId id) {
        User user = getUserByIdFromRepository(id);
        return modelMapper.map(user, UserProfileDTO.class);
    }

    @Override
    public UserDTO updateUser(ObjectId userId, UpdateUserDTO updateUserDTO) {
        User user = getUserByIdFromRepository(userId);
        if(updateUserDTO.imageUrl() != null)
            user.setImageUrl(updateUserDTO.imageUrl());
        if(updateUserDTO.displayName() != null)
            user.setDisplayName(updateUserDTO.displayName());
        if(updateUserDTO.phoneNumber() != null)
            user.setPhoneNumber(updateUserDTO.phoneNumber());
        user = userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO updateCarLicense(ObjectId userId, UpdateCarLicenseDTO updateCarLicenseDTO) {
        User user = getUserByIdFromRepository(userId);
        CarLicense license = new CarLicense(updateCarLicenseDTO.id(), updateCarLicenseDTO.fullName(), updateCarLicenseDTO.dob(), updateCarLicenseDTO.licenseImageUrl(), updateCarLicenseDTO.issuedDate(), updateCarLicenseDTO.issuedLocation());
        user.setCarLicense(license);
        user = userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO updateCitizenIdentification(ObjectId userId, UpdateCitizenIdentificationDTO updateCitizenIdentificationDTO) {
        User user = getUserByIdFromRepository(userId);
        CitizenIdentification citizenIdentification = new CitizenIdentification(
                updateCitizenIdentificationDTO.identificationNumber(),
                updateCitizenIdentificationDTO.passportNumber(),
                updateCitizenIdentificationDTO.issuedDate(),
                updateCitizenIdentificationDTO.issuedLocation(),
                updateCitizenIdentificationDTO.permanentAddress(),
                updateCitizenIdentificationDTO.contactAddress(),
                updateCitizenIdentificationDTO.identificationImageUrl()
        );
        user.setCitizenIdentification(citizenIdentification);
        user = userRepository.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDetailDTO getUserDetailById(ObjectId id) {
        return userRepository.getUserDetailById(id);
    }

    @Override
    public void addToken(ObjectId id, String address) {
        blockchainUtils.sendSepoliaETH(address, BigDecimal.valueOf(0.5));
    }

    @Override
    public void updateMetamaskAddress(ObjectId id, String address) {
        User user = getUserByIdFromRepository(id);
        user.setMetamaskAddress(address);
        userRepository.save(user);
    }
}
