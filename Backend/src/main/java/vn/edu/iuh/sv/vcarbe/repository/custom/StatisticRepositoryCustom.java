package vn.edu.iuh.sv.vcarbe.repository.custom;

import org.bson.Document;
import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.TimeInterval;

import java.util.Date;
import java.util.List;

public interface StatisticRepositoryCustom {
    List<Document> getDailyRentalContractStatistics(Date startDate, Date endDate, String rentalStatus, ObjectId lessor, ObjectId lessee);

    List<Document> getDailyInvoiceStatistics(Date startDate, Date endDate, String type);

    List<Document> countCarsByProvince();

    List<Document> getContractStatisticsByLessorOrLessee(Date startDate, Date endDate, boolean filterByLessor, String sortBy, String sortOrder);

    List<Document> getCarStatistics(Date startDate, Date endDate, ObjectId ownerId, String sortBy, String sortOrder);

    List<Document> getRentalVolumeByInterval(Date startDate, Date endDate, TimeInterval interval);
}
