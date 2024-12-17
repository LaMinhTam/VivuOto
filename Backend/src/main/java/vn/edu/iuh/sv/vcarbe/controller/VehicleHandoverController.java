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
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.VehicleHandoverServiceImpl;
import vn.edu.iuh.sv.vcarbe.util.EthersUtils;

@RestController
@RequestMapping("/vehicle-handover")
@Tag(name = "Vehicle Handover Controller", description = "APIs related to vehicle handover and return")
public class VehicleHandoverController {
    @Autowired
    private VehicleHandoverServiceImpl vehicleHandoverService;

    @Operation(summary = "Create a new vehicle handover document", description = "Creates a new vehicle handover document for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document created successfully"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @PostMapping
    public ResponseEntity<ApiResponseWrapper> createVehicleHandover(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestBody @Valid VehicleHandoverRequest request) {
//        EthersUtils.verifyMessage(request.getDigitalSignature());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.VEHICLE_HANDOVER_CREATE_SUCCESS.name(), vehicleHandoverService.createVehicleHandover(userPrincipal, request)));
    }

    @Operation(summary = "Approve vehicle handover by lessee", description = "Approves the vehicle handover document by the lessee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document approved by lessee"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to approve the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/approve-lessee")
    public ResponseEntity<ApiResponseWrapper> approveVehicleHandoverByLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id,
            @RequestBody DigitalSignature digitalSignature) {
//        EthersUtils.verifyMessage(digitalSignature);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.VEHICLE_HANDOVER_APPROVE_BY_LESSEE_SUCCESS.name(), vehicleHandoverService.approveByLessee(id, userPrincipal, digitalSignature)));
    }

    @Operation(summary = "Approve vehicle return by lessor", description = "Approves the vehicle return document by the lessor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle return document approved by lessor"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to approve the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/approve-lessor")
    public ResponseEntity<ApiResponseWrapper> approveVehicleReturnByLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id,
            @RequestBody DigitalSignature digitalSignature) {
//        EthersUtils.verifyMessage(digitalSignature);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.VEHICLE_HANDOVER_APPROVE_BY_LESSOR_SUCCESS.name(), vehicleHandoverService.approveByLessor(id, userPrincipal, digitalSignature)));
    }

    @Operation(summary = "Update vehicle handover document with return details", description = "Updates the vehicle handover document with return details by the lessee")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle return document updated successfully"),
            @ApiResponse(responseCode = "403", description = "User is not authorized to update the document"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @PutMapping("/{id}/return")
    public ResponseEntity<ApiResponseWrapper> updateVehicleHandover(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Vehicle Handover Document ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId id,
            @RequestBody @Valid VehicleReturnRequest request) {
//        EthersUtils.verifyMessage(request.getDigitalSignature());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.VEHICLE_HANDOVER_UPDATE_BY_LESSEE_SUCCESS.name(), vehicleHandoverService.updateVehicleReturn(id, request, userPrincipal)));
    }

    @Operation(summary = "Retrieve vehicle handover document by rental contract ID", description = "Retrieves the vehicle handover document associated with a rental contract ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover document retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Vehicle handover document not found")
    })
    @GetMapping("/rental-contract/{rentalContractId}")
    public ResponseEntity<ApiResponseWrapper> getVehicleHandoverByRentalContractId(
            @Parameter(description = "Rental Contract ID (must be a valid ObjectId)", schema = @Schema(type = "string", example = "60c72b2f9b1e8c001f0a0b4e"))
            @PathVariable ObjectId rentalContractId) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), vehicleHandoverService.getVehicleHandoverByRentalContractId(rentalContractId)));
    }

    @Operation(summary = "Get all vehicle handover documents for lessor", description = "Fetches all vehicle handover documents for the authenticated lessor with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover documents retrieved successfully")
    })
    @GetMapping("/lessor")
    public ResponseEntity<ApiResponseWrapperWithMeta> getVehicleHandoverForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Sort field", schema = @Schema(type = "string", example = "createdAt"))
            @RequestParam(defaultValue = "createdAt") String sortField,
            @Parameter(description = "Sort descending", schema = @Schema(type = "boolean", example = "true"))
            @RequestParam(defaultValue = "true") boolean sortDescending,
            @Parameter(description = "Page number", schema = @Schema(type = "integer", example = "0"))
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", schema = @Schema(type = "integer", example = "10"))
            @RequestParam(defaultValue = "10") int size) {
        Page<VehicleHandoverDocumentDTO> documentPage = vehicleHandoverService.getVehicleHandoverForLessor(userPrincipal.getId(), sortField, sortDescending, page, size);
        return ResponseEntity.ok(new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), documentPage.getContent(), new PaginationMetadata(documentPage)));
    }

    @Operation(summary = "Get all vehicle handover documents for lessee", description = "Fetches all vehicle handover documents for the authenticated lessee with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehicle handover documents retrieved successfully")
    })
    @GetMapping("/lessee")
    public ResponseEntity<ApiResponseWrapperWithMeta> getVehicleHandoverForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Sort field", schema = @Schema(type = "string", example = "createdAt"))
            @RequestParam(defaultValue = "createdAt") String sortField,
            @Parameter(description = "Sort descending", schema = @Schema(type = "boolean", example = "true"))
            @RequestParam(defaultValue = "true") boolean sortDescending,
            @Parameter(description = "Page number", schema = @Schema(type = "integer", example = "0"))
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size", schema = @Schema(type = "integer", example = "10"))
            @RequestParam(defaultValue = "10") int size) {
        Page<VehicleHandoverDocumentDTO> documentPage = vehicleHandoverService.getVehicleHandoverForLessee(userPrincipal.getId(), sortField, sortDescending, page, size);
        return ResponseEntity.ok(new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), documentPage.getContent(), new PaginationMetadata(documentPage)));
    }
}
