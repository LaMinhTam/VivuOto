package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
import vn.edu.iuh.sv.vcarbe.service.RentalContractService;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;
import vn.edu.iuh.sv.vcarbe.util.EthersUtils;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/rental-contracts")
@Tag(name = "Rental Contract Controller", description = "APIs related to rental contract management")
public class RentalContractController {
    @Autowired
    private RentalContractService rentalContractService;
    @Autowired
    private InvoiceService invoiceService;

    @Operation(summary = "Create a payment URL for rental contract", description = "Generates a payment URL for the lessee to make a payment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment URL created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or user not found")
    })
    @PostMapping("/lessee-approve")
    public ResponseEntity<ApiResponseWrapper> createPayment(
            HttpServletRequest req,
            @CurrentUser UserPrincipal userPrincipal,
            @Valid @RequestBody SignRequest signRequest) {
//        EthersUtils.verifyMessage(signRequest.digitalSignature());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PAYMENT_CREATE_SUCCESS.name(), invoiceService.createPaymentUrlContract(req, userPrincipal, signRequest)));
    }

    @Operation(summary = "Handle payment callback", description = "Handles the callback from VNPay after a payment is made")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment callback handled successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request or invoice not found")
    })
    @PostMapping("/payment-callback")
    public ResponseEntity<ApiResponseWrapper> approveRentalRequest(HttpServletRequest req) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PAYMENT_CALLBACK_SUCCESS.name(), invoiceService.handlePaymentCallbackContract(req)));
    }


    @Operation(summary = "Get rental contract by ID", description = "Fetches a rental contract by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contract found"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseWrapper> getRentalContract(
            @Parameter(description = "Rental contract ID (must be a valid ObjectId)", schema = @Schema(type = "string"))
            @PathVariable ObjectId id) throws Exception {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), rentalContractService.getRentalContract(id)));
    }

    @Operation(summary = "Get rental contracts for lessor", description = "Fetches all rental contracts for the authenticated lessor with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contracts retrieved successfully")
    })
    @GetMapping("/lessor")
    public ApiResponseWrapperWithMeta getRentalContractForLessor(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RentalContractDTO> rentalPage = rentalContractService.getRentalContractForLessor(userPrincipal.getId(), sortField, sortDescending, page, size);
        return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), rentalPage.getContent(), new PaginationMetadata(rentalPage));
    }


    @Operation(summary = "Get rental contracts for lessee", description = "Fetches all rental contracts for the authenticated lessee with pagination and sorting options")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Rental contracts retrieved successfully")
    })
    @GetMapping("/lessee")
    public ApiResponseWrapperWithMeta getRentalContractForLessee(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "false") boolean sortDescending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<RentalContractDTO> rentalPage = rentalContractService.getRentalContractForLessee(userPrincipal.getId(), sortField, sortDescending, page, size);
        return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), rentalPage.getContent(), new PaginationMetadata(rentalPage));
    }

    @PatchMapping("/{id}/post-handover")
    @Operation(summary = "Update post-handover issues status", description = "Update whether there are any post-handover issues for the rental contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Post-handover status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Rental contract not found")
    })
    public ResponseEntity<ApiResponseWrapper> updatePostHandoverStatus(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(description = "Rental contract ID (must be a valid ObjectId)", schema = @Schema(type = "string"))
            @PathVariable ObjectId id,
            @Valid @RequestBody PostHandoverUpdateDTO postHandoverUpdateDTO) {
        rentalContractService.updatePostHandoverIssues(userPrincipal, id, postHandoverUpdateDTO.handoverIssue());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), null));
    }
}
