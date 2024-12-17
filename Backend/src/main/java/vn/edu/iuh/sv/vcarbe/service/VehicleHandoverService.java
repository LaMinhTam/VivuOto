package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import vn.edu.iuh.sv.vcarbe.dto.DigitalSignature;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverDocumentDTO;
import vn.edu.iuh.sv.vcarbe.dto.VehicleHandoverRequest;
import vn.edu.iuh.sv.vcarbe.dto.VehicleReturnRequest;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface VehicleHandoverService {
    VehicleHandoverDocumentDTO createVehicleHandover(UserPrincipal userPrincipal, VehicleHandoverRequest request);

    VehicleHandoverDocumentDTO approveByLessee(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature);

    VehicleHandoverDocumentDTO approveByLessor(ObjectId id, UserPrincipal userPrincipal, DigitalSignature digitalSignature);

    VehicleHandoverDocumentDTO updateVehicleReturn(ObjectId id, VehicleReturnRequest request, UserPrincipal userPrincipal);

    VehicleHandoverDocumentDTO getVehicleHandoverByRentalContractId(ObjectId rentalContractId);

    Page<VehicleHandoverDocumentDTO> getVehicleHandoverForLessor(ObjectId id, String sortField, boolean sortDescending, int page, int size);

    Page<VehicleHandoverDocumentDTO> getVehicleHandoverForLessee(ObjectId id, String sortField, boolean sortDescending, int page, int size);
}
