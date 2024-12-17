package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapper;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponseWrapperWithMeta;
import vn.edu.iuh.sv.vcarbe.dto.InvoiceDTO;
import vn.edu.iuh.sv.vcarbe.dto.PaginationMetadata;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.CurrentUser;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.impl.InvoiceService;

@RestController
@RequestMapping("/invoices")
@Tag(name = "Invoice Controller", description = "APIs related to invoice management and payment")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @Operation(summary = "Get user invoices", description = "Retrieves a paginated list of invoices for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user invoices"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping
    public ApiResponseWrapperWithMeta getUserInvoices(
            @CurrentUser UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Page<InvoiceDTO> invoices = invoiceService.getUserInvoices(userPrincipal, page, size, sortBy, sortDir);
        return new ApiResponseWrapperWithMeta(200, MessageKeys.SUCCESS.name(), invoices.getContent(), new PaginationMetadata(invoices));
    }

    @Operation(summary = "Get invoice by ID", description = "Retrieves an invoice by its ID for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the invoice"),
            @ApiResponse(responseCode = "404", description = "Invoice not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized request")
    })
    @GetMapping("/{id}")
    public ApiResponseWrapper getInvoice(
            @CurrentUser UserPrincipal userPrincipal,
            @Parameter(
                    description = "Car ID (must be a valid ObjectId)",
                    schema = @Schema(type = "string")
            )
            @PathVariable ObjectId id) {
        return new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), invoiceService.getInvoiceById(userPrincipal, id));
    }

    @Operation(summary = "Payment callback", description = "Handles the payment callback from the payment gateway")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment callback processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid payment callback")
    })
    @PostMapping("/callback")
    public ApiResponseWrapper handlePaymentCallback(HttpServletRequest req) {
        invoiceService.handlePaymentCallbackCommon(req);
        return new ApiResponseWrapper(200, MessageKeys.SUCCESS.name(), null);
    }
}
