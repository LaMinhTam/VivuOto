package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import vn.edu.iuh.sv.vcarbe.dto.ApprovalRequest;
import vn.edu.iuh.sv.vcarbe.dto.RentRequestDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalContractDTO;
import vn.edu.iuh.sv.vcarbe.dto.RentalRequestDTO;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface RentalRequestService {
    RentalRequestDTO createRentalRequest(RentRequestDTO rentRequestDTO, ObjectId lesseeId);

    RentalContractDTO approveRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest) throws Exception;

    RentalRequestDTO rejectRentalContract(UserPrincipal userPrincipal, ApprovalRequest approvalRequest);

    Page<RentalRequestDTO> getRentalRequestForLessor(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);

    Page<RentalRequestDTO> getRentalRequestForLessee(ObjectId id, String sortField, boolean sortDescending, RentRequestStatus status, int page, int size);

    RentalRequestDTO getRentalRequest(ObjectId id);

    RentalContractDTO getRentalContractByRentalRequestId(ObjectId id);
}
