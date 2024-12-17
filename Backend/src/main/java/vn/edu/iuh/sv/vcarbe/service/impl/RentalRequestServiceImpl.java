package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.*;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.RentalRequestRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.util.Date;
import java.util.List;

@Service
public class RentalRequestServiceImpl implements RentalRequestService {
    private final RentalContractRepository rentalContractRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final ModelMapper modelMapper;
    private final NotificationUtils notificationUtils;
    private final BlockchainUtils blockchainUtils;

    @Autowired
    public RentalRequestServiceImpl(RentalContractRepository rentalContractRepository, CarRepository carRepository, UserRepository userRepository, RentalRequestRepository rentalRequestRepository, ModelMapper modelMapper, NotificationUtils notificationUtils, BlockchainUtils blockchainUtils) {
        this.rentalContractRepository = rentalContractRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.modelMapper = modelMapper;
        this.notificationUtils = notificationUtils;
        this.blockchainUtils = blockchainUtils;
    }

    @Override
    public RentalRequestDTO createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId) {
        Car car = carRepository.findById(rentRequestDTO.carId())
                .orElseThrow(() -> new AppException(404, MessageKeys.CAR_NOT_FOUND.name()));

        RentalRequest request = new RentalRequest(rentRequestDTO, car, lesseeId);
        RentalRequest savedRequest = rentalRequestRepository.save(request);
        notificationUtils.createNotification(
                savedRequest.getLessorId(),
                NotificationMessage.NEW_RENTAL_REQUEST,
                NotificationType.RENTAL_REQUEST,
                "/rental-requests/" + savedRequest.getId(),
                savedRequest.getId());
        return modelMapper.map(savedRequest, RentalRequestDTO.class);
    }


    public RentalContractDTO approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) {
        RentalRequest rentalRequest = rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name()));

        rentalRequest.setStatus(RentRequestStatus.APPROVED);
        rentalRequest.setUpdatedAt(new Date());
        rentalRequestRepository.save(rentalRequest);
        Car car = carRepository.findById(rentalRequest.getCarId())
                .orElseThrow(() -> new AppException(404, MessageKeys.CAR_NOT_FOUND.name()));

        User lessorUser = userRepository.findById(rentalRequest.getLessorId())
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));
        RentalContract rentalContract = new RentalContract(rentalRequest, lessorUser, car, approvalRequest);
        RentalContract savedContract = rentalContractRepository.save(rentalContract);

        notificationUtils.createNotification(
                savedContract.getLesseeId(),
                NotificationMessage.RENTAL_REQUEST_APPROVED,
                NotificationType.RENTAL_CONTRACT,
                "/rental-contracts/" + savedContract.getId(),
                savedContract.getId());
        blockchainUtils.createRentalContract(savedContract);
        return modelMapper.map(savedContract, RentalContractDTO.class);
    }

    @Override
    public RentalRequestDTO rejectRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) {
        RentalRequest rentalRequest = rentalRequestRepository.findByIdAndLessorId(approvalRequest.requestId(), userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name()));

        rentalRequest.setStatus(RentRequestStatus.REJECTED);
        rentalRequestRepository.save(rentalRequest);
        notificationUtils.createNotification(
                rentalRequest.getLesseeId(),
                NotificationMessage.RENTAL_REQUEST_REJECTED,
                NotificationType.RENTAL_REQUEST,
                "/rental-requests/" + rentalRequest.getId(),
                rentalRequest.getId());
        return modelMapper.map(rentalRequest, RentalRequestDTO.class);
    }

    @Override
    public Page<RentalRequestDTO> getRentalRequestForLessor(
            ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {

        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalRequest> rentalRequestPage;
        if (status != null) {
            rentalRequestPage = rentalRequestRepository.findByLessorIdAndStatus(id, status, pageable);
        } else {
            rentalRequestPage = rentalRequestRepository.findByLessorId(id, pageable);
        }

        List<RentalRequestDTO> rentalRequestDTOs = rentalRequestPage.getContent().stream()
                .map(request -> modelMapper.map(request, RentalRequestDTO.class))
                .toList();

        return new PageImpl<>(rentalRequestDTOs, pageable, rentalRequestPage.getTotalElements());
    }


    @Override
    public Page<RentalRequestDTO> getRentalRequestForLessee(
            ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size) {

        Sort sort = sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField));
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RentalRequest> rentalRequestPage;
        if (status != null) {
            rentalRequestPage = rentalRequestRepository.findByLesseeIdAndStatus(id, status, pageable);
        } else {
            rentalRequestPage = rentalRequestRepository.findByLesseeId(id, pageable);
        }

        List<RentalRequestDTO> rentalRequestDTOs = rentalRequestPage.getContent().stream()
                .map(request -> modelMapper.map(request, RentalRequestDTO.class))
                .toList();

        return new PageImpl<>(rentalRequestDTOs, pageable, rentalRequestPage.getTotalElements());
    }


    @Override
    public RentalRequestDTO getRentalRequest(ObjectId id) {
        RentalRequest rentalRequest = rentalRequestRepository.findById(id)
                .orElseThrow(() -> new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name()));
        return modelMapper.map(rentalRequest, RentalRequestDTO.class);
    }

    @Override
    public RentalContractDTO getRentalContractByRentalRequestId(ObjectId id) {
        RentalContract rentalContract = rentalContractRepository.findByRentalRequestId(id)
                .orElseThrow(() -> new AppException(404, MessageKeys.RENTAL_REQUEST_NOT_FOUND.name()));
        return modelMapper.map(rentalContract, RentalContractDTO.class);
    }
}
