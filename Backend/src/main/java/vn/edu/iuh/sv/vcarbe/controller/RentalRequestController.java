package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.RentRequestStatus;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.RentalRequestService;
import vn.edu.iuh.sv.vcarbe.util.EthersUtils;

@RestController
@RequestMapping("/rental-requests")
@Tag(name = "Rental Request Controller", description = "APIs related to rental requests management")
public class RentalRequestController {

    @Autowired
    private RentalRequestService rentalRequestService;

    @Operation(summary = "Create a new rental contract", description = "Creates a new rental contract for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract created successfully"),
            @ApiResponse(responseCode = "400", description = "User is not verified or request is invalid")
    })
    @PostMapping("/rent")
    public ResponseEntity<ApiResponseWrapper> createRentalContract(
            @RequestBody RentRequestDTO rentRequestDTO,
            @CurrentUser UserPrincipal userPrincipal) {
        if (!userPrincipal.isVerify()) {
            return ResponseEntity.badRequest().body(new ApiResponseWrapper(400, MessageKeys.USER_NOT_VERIFIED.name(), null));
        }
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.RENTAL_CREATE_SUCCESS.name(), rentalRequestService.createRentalRequest(rentRequestDTO, userPrincipal.getId())));
    }


    @Operation(summary = "Approve a rental request", description = "Approves a rental request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract approved successfully"),
            @ApiResponse(responseCode = "400", description = "Request is invalid or user is not authorized")
    })
    @PostMapping("/approve")
    public ResponseEntity<ApiResponseWrapper> approveRentalRequest(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestBody ApprovalRequest approvalRequest) throws Exception {
//        EthersUtils.verifyMessage(approvalRequest.digitalSignature());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.RENTAL_APPROVE_SUCCESS.name(), rentalRequestService.approveRentalContract(userPrincipal, approvalRequest)));
    }

    @Operation(summary = "Reject a rental request", description = "Rejects a rental request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Request is invalid")
    })
    @PostMapping("/reject")
    public ResponseEntity<ApiResponseWrapper> rejectRentalRequest(
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody ApprovalRequest approvalRequest) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.RENTAL_REJECT_SUCCESS.name(), rentalRequestService.rejectRentalContract(userPrincipal, approvalRequest)));
    }

    @Operation(summary = "Get rental requests for lessor", description = "Retrieves rental requests for the lessor based on various criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental requests retrieved successfully")
    })
    @GetMapping("/lessor")
    public ApiResponseWrapperWithMeta getRentalRequestForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(required = false) RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RentalRequestDTO> rentalRequestPage = rentalRequestService.getRentalRequestForLessor(userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), rentalRequestPage.getContent(), new PaginationMetadata(rentalRequestPage));
    }


    @Operation(summary = "Get rental requests for lessee", description = "Retrieves rental requests for the lessee based on various criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental requests retrieved successfully")
    })
    @GetMapping("/lessee")
    public ApiResponseWrapperWithMeta getRentalRequestForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(required = false) RentRequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RentalRequestDTO> rentalRequestPage = rentalRequestService.getRentalRequestForLessee(userPrincipal.getId(), sortField, sortDescending, status, page, size);
        return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), rentalRequestPage.getContent(), new PaginationMetadata(rentalRequestPage));
    }


    @Operation(summary = "Get a rental request by ID", description = "Finds a rental request by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental request found successfully"),
            @ApiResponse(responseCode = "404", description = "Rental request not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseWrapper> getRentalRequest(
            @Parameter(description = "Rental request ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "64b64c8f12e94c080e8e4567"))
            @PathVariable ObjectId id) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), rentalRequestService.getRentalRequest(id)));
    }

    @Operation(summary = "Get rental contract by a rental request by ID", description = "Finds a rental contract by a rental request ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract found successfully"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @GetMapping("/{id}/contract")
    public ResponseEntity<ApiResponseWrapper> getRentalContractByRequest(
            @Parameter(description = "Rental request ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "64b64c8f12e94c080e8e4567"))
            @PathVariable ObjectId id) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), rentalRequestService.getRentalContractByRentalRequestId(id)));
    }
}
