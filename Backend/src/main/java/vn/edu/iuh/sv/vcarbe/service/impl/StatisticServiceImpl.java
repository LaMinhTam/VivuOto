package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.repository.custom.StatisticRepositoryCustom;
import vn.edu.iuh.sv.vcarbe.service.StatisticService;

import java.util.Date;
import java.util.List;

@Service
public class StatisticServiceImpl implements StatisticService {
    @Autowired
    private StatisticRepositoryCustom statisticRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<InvoiceSummaryDto> getDailyInvoiceSummary(Date startDate, Date endDate, String type) {
        List<Document> statistics = statisticRepository.getDailyInvoiceStatistics(startDate, endDate, type);
        return statistics.stream()
                .map(document -> modelMapper.map(document, InvoiceSummaryDto.class))
                .toList();
    }

    @Override
    public List<RentalContractSummaryDto> getDailyRentalContractSummary(Date startDate, Date endDate, String rentalStatus, ObjectId lessor, ObjectId lesse) {
        List<Document> test = statisticRepository.getDailyRentalContractStatistics(startDate, endDate, rentalStatus, lessor, lesse);
        return test.stream()
                .map(document -> modelMapper.map(document, RentalContractSummaryDto.class))
                .toList();
    }

    @Override
    public List<ProvinceCarCountDto> getCarsByProvince() {
        List<Document> rawStatistics = statisticRepository.countCarsByProvince();
        return rawStatistics.stream()
                .map(document -> {
                    Province province = Province.valueOf(document.getString("province"));
                    int carCount = document.getInteger("carCount");
                    return new ProvinceCarCountDto(province.getDisplayName(), carCount);
                })
                .toList();
    }

    @Override
    public List<RentalContractSummaryDto> getContractStatistics(Date startDate, Date endDate, boolean filterByLessor, String sortBy, String sortOrder) {
        List<Document> statistics = statisticRepository.getContractStatisticsByLessorOrLessee(startDate, endDate, filterByLessor, sortBy, sortOrder);
        return statistics.stream()
                .map(document -> new RentalContractSummaryDto(
                        document.getString("displayName"),
                        document.getInteger("totalContracts"),
                        document.getDouble("totalRentalValue")
                ))
                .toList();
    }

    @Override
    public List<CarStatisticDto> getCarStatistics(Date startDate, Date endDate, ObjectId ownerId, String sortBy, String sortOrder) {
        List<Document> statistics = statisticRepository.getCarStatistics(startDate, endDate, ownerId, sortBy, sortOrder);
        //check if the carName duplicate add [1], [2], [3]... to display name
        for (int i = 0; i < statistics.size(); i++) {
            int count = 2;
            for (int j = i + 1; j < statistics.size(); j++) {
                if (statistics.get(i).getString("carName").equals(statistics.get(j).getString("carName"))) {
                    statistics.get(j).put("carName", statistics.get(j).getString("carName") + " [" + (count++) + "]");
                }
            }
        }
        return statistics.stream()
                .map(document -> new CarStatisticDto(
                        document.getObjectId("carId").toHexString(),
                        document.getString("carName"),
                        document.getInteger("totalContracts"),
                        document.getDouble("totalRentalValue")
                ))
                .toList();
    }

    public List<MonthlyRentalVolumeDto> getMonthlyRentalVolume(Date startDate, Date endDate, TimeInterval interval) {
        List<Document> documents = statisticRepository.getRentalVolumeByInterval(startDate, endDate, interval);
        return documents.stream()
                .map(document -> new MonthlyRentalVolumeDto(
                        document.getString("intervalLabel"),
                        document.getInteger("totalContracts"),
                        document.getInteger("totalFreeCars"),
                        document.getInteger("totalRentedCars"),
                        document.getDouble("totalIncome")
                ))
                .toList();
    }
}
