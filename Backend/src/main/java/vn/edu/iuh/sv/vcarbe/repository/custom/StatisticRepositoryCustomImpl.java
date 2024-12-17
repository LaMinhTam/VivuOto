package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import com.mongodb.client.MongoClient;
import vn.edu.iuh.sv.vcarbe.dto.TimeInterval;

@Repository
public class StatisticRepositoryCustomImpl implements StatisticRepositoryCustom {
    @Autowired
    private MongoClient mongoClient;

    private MongoCollection<Document> getRentalContractCollection(String collectionName) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection(collectionName);
    }

    @Override
    public List<Document> getDailyRentalContractStatistics(Date startDate, Date endDate, String rentalStatus, ObjectId lessor, ObjectId lessee) {
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));
        if (rentalStatus != null) {
            matchCriteria.append("rentalStatus", rentalStatus);
        }
        if (lessor != null) {
            matchCriteria.append("lessorId", lessor);
        }
        if (lessee != null) {
            matchCriteria.append("lesseeId", lessee);
        }
        boolean calculateIncome = (lessor == null && lessee == null);

        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("dayLabel", new Document("$dateToString",
                        new Document("format", "%Y-%m-%d").append("date", "$createdAt")))
                        .append("status", "$rentalStatus"))
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                        .append("income", new Document("$sum", calculateIncome
                                ? new Document("$multiply", Arrays.asList("$totalRentalValue", 0.3))
                                : 0))
                ),
                new Document("$project", new Document("dayLabel", "$_id.dayLabel")
                        .append("status", "$_id.status")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("income", calculateIncome ? "$income" : null)  // Show income only if no lessor or lessee
                        .append("_id", 0)),
                new Document("$sort", new Document("dayLabel", 1))
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getDailyInvoiceStatistics(Date startDate, Date endDate, String type) {
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));

        if (type != null) {
            matchCriteria.append("type", type);
        }
        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("dayLabel", new Document("$dateToString",
                        new Document("format", "%Y-%m-%d").append("date", "$createdAt")))
                        .append("type", "$type"))
                        .append("totalInvoices", new Document("$sum", 1))
                        .append("totalAmount", new Document("$sum", "$amount"))
                ),
                new Document("$project", new Document("dayLabel", "$_id.dayLabel")
                        .append("type", "$_id.type")
                        .append("totalInvoices", 1)
                        .append("totalAmount", 1)
                        .append("_id", 0)),
                new Document("$sort", new Document("dayLabel", 1))
        );


        return getRentalContractCollection("invoice").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> countCarsByProvince() {
        List<Document> pipeline = Arrays.asList(
                new Document("$group", new Document("_id", "$province")
                        .append("carCount", new Document("$sum", 1))
                ),
                new Document("$project", new Document("province", "$_id")
                        .append("carCount", 1)
                        .append("_id", 0))
        );

        return getRentalContractCollection("cars").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getContractStatisticsByLessorOrLessee(Date startDate, Date endDate, boolean filterByLessor, String sortBy, String sortOrder) {
        String userIdField = filterByLessor ? "lessorId" : "lesseeId";
        int sortDirection = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
        List<Document> pipeline = Arrays.asList(
                new Document("$match", new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate))),
                new Document("$group", new Document("_id", "$" + userIdField)
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                ),
                new Document("$lookup", new Document("from", "users")
                        .append("localField", "_id")
                        .append("foreignField", "_id")
                        .append("as", "userInfo")),
                new Document("$unwind", new Document("path", "$userInfo").append("preserveNullAndEmptyArrays", true)),
                new Document("$project", new Document("displayName", "$userInfo.displayName")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("_id", 0)
                ),
                new Document("$sort", new Document(sortBy, sortDirection)),
                new Document("$limit", 10)
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

    @Override
    public List<Document> getCarStatistics(Date startDate, Date endDate, ObjectId ownerId, String sortBy, String sortOrder) {
        int sortDirection = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
        Document matchCriteria = new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate));
        if (ownerId != null) {
            matchCriteria.append("ownerId", ownerId);
        }

        List<Document> pipeline = Arrays.asList(
                new Document("$match", matchCriteria),
                new Document("$group", new Document("_id", new Document("carId", "$carId")
                        .append("carName", "$vehicleName"))
                        .append("totalContracts", new Document("$sum", 1))
                        .append("totalRentalValue", new Document("$sum", "$totalRentalValue"))
                ),
                new Document("$project", new Document("carId", "$_id.carId")
                        .append("carName", "$_id.carName")
                        .append("totalContracts", 1)
                        .append("totalRentalValue", 1)
                        .append("_id", 0)
                ),
                new Document("$sort", new Document(sortBy, sortDirection))
        );

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }

    public List<Document> getRentalVolumeByInterval(Date startDate, Date endDate, TimeInterval interval) {
        Document groupByFields = new Document();
        switch (interval) {
            case YEAR:
                groupByFields.append("intervalLabel", new Document("$dateToString", new Document("format", "%Y").append("date", "$createdAt")));
                break;
            case QUARTER:
                groupByFields.append("year", new Document("$year", "$createdAt"));
                groupByFields.append("quarter", new Document("$switch", new Document("branches", Arrays.asList(
                        new Document("case", new Document("$lte", Arrays.asList(new Document("$month", "$createdAt"), 3))).append("then", "Q1"),
                        new Document("case", new Document("$lte", Arrays.asList(new Document("$month", "$createdAt"), 6))).append("then", "Q2"),
                        new Document("case", new Document("$lte", Arrays.asList(new Document("$month", "$createdAt"), 9))).append("then", "Q3"),
                        new Document("case", new Document("$lte", Arrays.asList(new Document("$month", "$createdAt"), 12))).append("then", "Q4")
                ))));
                break;
            case MONTH:
                groupByFields.append("intervalLabel", new Document("$dateToString", new Document("format", "%Y-%m").append("date", "$createdAt")));
                break;
            case WEEK:
                groupByFields.append("intervalLabel", new Document("$dateToString", new Document("format", "%Y-W%U").append("date", "$createdAt")));
                break;
            case DAY:
                groupByFields.append("intervalLabel", new Document("$dateToString", new Document("format", "%Y-%m-%d").append("date", "$createdAt")));
                break;
            default:
                throw new IllegalArgumentException("Unsupported interval: " + interval);
        }
        List<Document> pipeline = new ArrayList<>();
        pipeline.add(new Document("$match", new Document("createdAt", new Document("$gte", startDate).append("$lte", endDate))));
        Document groupFields = new Document("_id", groupByFields)
                .append("totalContracts", new Document("$sum", 1))
                .append("totalIncome", new Document("$sum", new Document("$multiply", Arrays.asList("$totalRentalValue", 0.3))))
                .append("carIds", new Document("$addToSet", "$carId"));
        pipeline.add(new Document("$group", groupFields));
        if (interval == TimeInterval.QUARTER) {
            pipeline.add(new Document("$project", new Document("intervalLabel",
                    new Document("$concat", Arrays.asList(
                            new Document("$toString", "$_id.year"), "-", "$_id.quarter"
                    )))
                    .append("totalContracts", 1)
                    .append("totalIncome", 1)
                    .append("carIds", 1)
            ));
        }
        pipeline.add(new Document("$lookup", new Document("from", "cars")
                .append("let", new Document("rentedCarIds", "$carIds"))
                .append("pipeline", Arrays.asList(
                        new Document("$match", new Document("$expr", new Document("$not", new Document("$in", Arrays.asList("$_id", "$$rentedCarIds"))))),
                        new Document("$count", "totalFreeCars")
                ))
                .append("as", "freeCars")
        ));
        Document projectFields = new Document("intervalLabel", interval == TimeInterval.QUARTER ? "$intervalLabel" : "$_id.intervalLabel")
                .append("totalContracts", "$totalContracts")
                .append("totalRentedCars", new Document("$size", "$carIds"))
                .append("totalFreeCars", new Document("$arrayElemAt", Arrays.asList("$freeCars.totalFreeCars", 0)))
                .append("totalIncome", "$totalIncome")
                .append("_id", 0);
        pipeline.add(new Document("$project", projectFields));
        pipeline.add(new Document("$sort", new Document("intervalLabel", 1)));

        return getRentalContractCollection("rental_contracts").aggregate(pipeline).into(new ArrayList<>());
    }


}
