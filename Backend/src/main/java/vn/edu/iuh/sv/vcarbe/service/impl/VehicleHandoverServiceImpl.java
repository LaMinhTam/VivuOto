package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.DigitalSignature;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.entity.HandoverStatus;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.entity.VehicleHandoverDocument;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RentalContractRepository;
import vn.edu.iuh.sv.vcarbe.repository.VehicleHandoverRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.VehicleHandoverService;

import java.util.List;

@Service
public class VehicleHandoverServiceImpl implements VehicleHandoverService {
    @Autowired
    private VehicleHandoverRepository vehicleHandoverRepository;
    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public VehicleHandoverDocumentDTO createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request) {
        RentalContract rentalContract = rentalContractRepository.findByLessorIdAndId(userPrincipal.getId(), request.getRentalContractId())
                .orElseThrow(() -> new AppException(404, MessageKeys.CONTRACT_NOT_FOUND.name()));

        VehicleHandoverDocument document = new VehicleHandoverDocument();
        document.setLesseeId(rentalContract.getLesseeId());
        document.setLessorId(rentalContract.getLessorId());
        document.setRentalContractId(request.getRentalContractId());
        document.setLessorName(rentalContract.getLessorName());
        document.setLesseeName(rentalContract.getLesseeName());
        document.setLocation(rentalContract.getVehicleHandOverLocation());
        document.setCarBrand(rentalContract.getVehicleBrand());
        document.setCarName(rentalContract.getVehicleName());
        document.setCarColor(rentalContract.getVehicleColor());
        document.setCarManufacturingYear(rentalContract.getVehicleManufacturingYear());
        document.setCarLicensePlate(rentalContract.getVehicleLicensePlate());
        document.setCarSeat(rentalContract.getVehicleSeat());
        document.setHandoverDate(request.getHandoverDate());
        document.setHandoverHour(request.getHandoverHour());
        document.setInitialConditionNormal(request.isInitialConditionNormal());
        document.setVehicleCondition(request.getVehicleCondition());
        document.setDamages(request.getDamages());
        document.setOdometerReading(request.getOdometerReading());
        document.setFuelLevel(request.getFuelLevel());
        document.setPersonalItems(request.getPersonalItems());
        document.setCollateral(request.getCollateral());
        document.setLessorSignature(request.getDigitalSignature().signatureUrl());
        document.setStatus(HandoverStatus.CREATED);
        document = vehicleHandoverRepository.save(document);
        return modelMapper.map(document, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO approveByLessee(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId()).
                orElseThrow(() -> new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name()));
        document.setLesseeApproved(true);
        document.setLesseeSignature(digitalSignature.signatureUrl());
        document.setStatus(HandoverStatus.RENDING);
        document = vehicleHandoverRepository.save(document);
        return modelMapper.map(document, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO approveByLessor(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findByIdAndLessorId(id, userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name()));
        document.setLessorApproved(true);
        document.setReturnLessorSignature(digitalSignature.signatureUrl());
        document.setStatus(HandoverStatus.RETURNED);
        document = vehicleHandoverRepository.save(document);
        return modelMapper.map(document, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findByIdAndLesseeId(id, userPrincipal.getId()).orElseThrow(() -> new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name()));
        document.setReturnDate(request.getReturnDate());
        document.setReturnHour(request.getReturnHour());
        document.setConditionMatchesInitial(request.isConditionMatchesInitial());
        document.setReturnVehicleCondition(request.getVehicleCondition());
        document.setReturnDamages(request.getDamages());
        document.setReturnOdometerReading(request.getOdometerReading());
        document.setReturnFuelLevel(request.getFuelLevel());
        document.setReturnPersonalItems(request.getPersonalItems());
        document.setReturnLesseeSignature(request.getDigitalSignature().signatureUrl());
        document.setStatus(HandoverStatus.RETURNING);
        document = vehicleHandoverRepository.save(document);
        return modelMapper.map(document, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public VehicleHandoverDocumentDTO getVehicleHandoverByRentalContractId(ObjectId rentalContractId) {
        VehicleHandoverDocument document = vehicleHandoverRepository.findByRentalContractId(rentalContractId)
                .orElseThrow(() -> new AppException(404, MessageKeys.VEHICLE_HANDOVER_NOT_FOUND.name()));
        return modelMapper.map(document, VehicleHandoverDocumentDTO.class);
    }

    @Override
    public Page<VehicleHandoverDocumentDTO> getVehicleHandoverForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField)));

        Page<VehicleHandoverDocument> documentPage = vehicleHandoverRepository.findByLessorId(id, pageable);
        List<VehicleHandoverDocumentDTO> dtos = documentPage.getContent().stream()
                .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class))
                .toList();
        return new PageImpl<>(dtos, pageable, documentPage.getTotalElements());
    }

    @Override
    public Page<VehicleHandoverDocumentDTO> getVehicleHandoverForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, sortDescending ? Sort.by(Sort.Order.desc(sortField)) : Sort.by(Sort.Order.asc(sortField)));

        Page<VehicleHandoverDocument> documentPage = vehicleHandoverRepository.findByLesseeId(id, pageable);
        List<VehicleHandoverDocumentDTO> dtos = documentPage.getContent().stream()
                .map(document -> modelMapper.map(document, VehicleHandoverDocumentDTO.class))
                .toList();
        return new PageImpl<>(dtos, pageable, documentPage.getTotalElements());
    }
}
