package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceSummaryDto {
    private String dayLabel;
    private String type;
    private int totalInvoices;
    private long totalAmount;
}