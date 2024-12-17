package vn.edu.iuh.sv.vcarbe.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.service.StatisticService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/stats")
public class StatisticController {
    @Autowired
    private StatisticService statisticService;

    @GetMapping("/invoice-summary")
    public ResponseEntity<ApiResponseWrapper> getInvoiceSummary(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate,
            @RequestParam(required = false) String type) {
        List<InvoiceSummaryDto> invoiceSummary = statisticService.getDailyInvoiceSummary(startDate, endDate, type);
        return ResponseEntity.ok(new ApiResponseWrapper(200, null, invoiceSummary));
    }

    @GetMapping("/rental-contract-summary")
    public List<RentalContractSummaryDto> getRentalContractSummary(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate,
            @RequestParam(required = false) String rentalStatus,
            @RequestParam(required = false) ObjectId lessor,
            @RequestParam(required = false) ObjectId lessee) {
        return statisticService.getDailyRentalContractSummary(startDate, endDate, rentalStatus, lessor, lessee);
    }

    @GetMapping("/cars-by-province")
    public ResponseEntity<ApiResponseWrapper> getCarsByProvince() {
        List<ProvinceCarCountDto> statistics = statisticService.getCarsByProvince();
        return ResponseEntity.ok(new ApiResponseWrapper(200, null, statistics));
    }

    @GetMapping("/user-contract-summary")
    public ResponseEntity<ApiResponseWrapper> getContractSummary(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate,
            @RequestParam(required = false, defaultValue = "true") boolean filterByLessor,
            @RequestParam(defaultValue = "totalContracts") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        List<RentalContractSummaryDto> contractSummary = statisticService.getContractStatistics(startDate, endDate, filterByLessor, sortBy, sortOrder);
        return ResponseEntity.ok(new ApiResponseWrapper(200, null, contractSummary));
    }

    @GetMapping("/car-statistics")
    public ResponseEntity<ApiResponseWrapper> getCarStatistics(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate,
            @RequestParam(required = false) ObjectId ownerId,
            @RequestParam(defaultValue = "totalContracts") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        List<CarStatisticDto> carStatistics = statisticService.getCarStatistics(startDate, endDate, ownerId, sortBy, sortOrder);
        return ResponseEntity.ok(new ApiResponseWrapper(200, null, carStatistics));
    }

    @GetMapping("/monthly-rental-volume")
    public ResponseEntity<ApiResponseWrapper> getMonthlyRentalVolume(
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy") Date endDate,
            TimeInterval timeInterval) {
        List<MonthlyRentalVolumeDto> monthlyRentalVolume = statisticService.getMonthlyRentalVolume(startDate, endDate, timeInterval);
        return ResponseEntity.ok(new ApiResponseWrapper(200, null, monthlyRentalVolume));
    }
}
