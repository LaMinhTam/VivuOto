package vn.edu.iuh.sv.vcarbe.repository.custom;

import com.mongodb.client.*;
import com.mongodb.client.model.*;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.*;

import java.util.*;

@Repository
public class CarRepositoryCustomImpl implements CarRepositoryCustom {
    @Autowired
    private MongoClient mongoClient;
    @Autowired
    private ModelMapper modelMapper;

    private MongoCollection<Document> getCollection(String collectionName) {
        MongoDatabase database = mongoClient.getDatabase("VCar");
        return database.getCollection(collectionName);
    }

    private Bson buildSearchQuery(SearchCriteria criteria) {
        Bson nameSearchQuery = criteria.getQuery() != null ? Filters.regex("name", criteria.getQuery(), "i") : Filters.exists("name");
        Bson provinceFilter = criteria.getProvince() != null ? Filters.eq("province", criteria.getProvince()) : Filters.exists("province");
        Bson transmissionFilter = criteria.getTransmission() != null && criteria.getTransmission().length > 0 ? Filters.in("transmission", (Object[]) criteria.getTransmission()) : Filters.exists("transmission");
        Bson seatsFilter = buildSeatsFilter(criteria.getSeats());
        Bson minConsumptionFilter = criteria.getMinConsumption() != null ? Filters.gte("fuelConsumption", criteria.getMinConsumption()) : Filters.exists("fuelConsumption");
        Bson maxConsumptionFilter = criteria.getMaxConsumption() != null ? Filters.lte("fuelConsumption", criteria.getMaxConsumption()) : Filters.exists("fuelConsumption");
        Bson maxRateFilter = criteria.getMaxRate() != null ? Filters.lte("dailyRate", criteria.getMaxRate()) : Filters.exists("dailyRate");

        return Filters.and(provinceFilter, nameSearchQuery, transmissionFilter, seatsFilter, minConsumptionFilter, maxConsumptionFilter, maxRateFilter);
    }

    private Bson buildSeatsFilter(Integer[] seats) {
        if (seats == null || seats.length == 0) {
            return Filters.exists("seat");
        }

        Arrays.sort(seats);
        List<Bson> filters = new ArrayList<>();
        boolean hasContinuousRange = isContinuousSequence(seats);

        if (hasContinuousRange) {
            filters.add(Filters.gte("seat", seats[0]));
        } else {
            List<Bson> orFilters = new ArrayList<>();
            for (int seat : seats) {
                if (seat >= 10) {
                    orFilters.add(Filters.gte("seat", seat));
                } else {
                    orFilters.add(Filters.eq("seat", seat));
                }
            }
            filters.add(Filters.or(orFilters));
        }

        return Filters.and(filters);
    }

    private boolean isContinuousSequence(Integer[] seats) {
        List<Integer> allowedSeats = Arrays.asList(2, 4, 5, 7, 9, 10);
        Arrays.sort(seats);

        int lastIndex = -1;
        for (int seat : seats) {
            int currentIndex = allowedSeats.indexOf(seat);
            if (currentIndex == -1 || (lastIndex != -1 && currentIndex != lastIndex + 1)) {
                return false;
            }
            lastIndex = currentIndex;
        }
        return true;
    }

    private List<Bson> buildPipeline(Bson filter, Pageable pageable, Date searchStartDate, Date searchEndDate, Integer rating) {
        List<Bson> pipeline = new ArrayList<>();
        pipeline.add(Aggregates.match(filter));
        if (searchStartDate != null && searchEndDate != null) {
            pipeline.add(Aggregates.lookup("rental_contracts", "_id", "carId", "rentalContracts"));
            pipeline.add(Aggregates.unwind("$rentalContracts", new UnwindOptions().preserveNullAndEmptyArrays(true)));
            Bson rentalDateFilter = Filters.or(
                    Filters.and(
                            Filters.lte("rentalContracts.rentalStartDate", searchEndDate),
                            Filters.gte("rentalContracts.rentalEndDate", searchStartDate)
                    ),
                    Filters.exists("rentalContracts._id", false)
            );
            pipeline.add(Aggregates.match(rentalDateFilter));
        }

        pipeline.add(Aggregates.lookup("users", "owner", "_id", "ownerDetails"));
        pipeline.add(Aggregates.unwind("$ownerDetails"));
        pipeline.add(Aggregates.lookup("reviews", "_id", "carId", "reviews"));
        pipeline.add(Aggregates.unwind("$reviews", new UnwindOptions().preserveNullAndEmptyArrays(true)));

        pipeline.add(Aggregates.group(
                "$_id",
                Accumulators.avg("averageRating", "$reviews.rating"),
                Accumulators.first("name", "$name"),
                Accumulators.first("status", "$status"),
                Accumulators.first("imageUrl", "$imageUrl"),
                Accumulators.first("province", "$province"),
                Accumulators.first("location", "$location"),
                Accumulators.first("dailyRate", "$dailyRate"),
                Accumulators.first("seat", "$seat"),
                Accumulators.first("transmission", "$transmission"),
                Accumulators.first("fuel", "$fuel"),
                Accumulators.first("fuelConsumption", "$fuelConsumption"),
                Accumulators.first("description", "$description"),
                Accumulators.first("features", "$features"),
                Accumulators.first("color", "$color"),
                Accumulators.first("licensePlate", "$licensePlate"),
                Accumulators.first("registrationNumber", "$registrationNumber"),
                Accumulators.first("registrationDate", "$registrationDate"),
                Accumulators.first("registrationLocation", "$registrationLocation"),
                Accumulators.first("mileageLimitPerDay", "$mileageLimitPerDay"),
                Accumulators.first("extraMileageCharge", "$extraMileageCharge"),
                Accumulators.first("extraHourlyCharge", "$extraHourlyCharge"),
                Accumulators.first("ownerId", "$ownerDetails._id"),
                Accumulators.first("ownerEmail", "$ownerDetails.email"),
                Accumulators.first("ownerDisplayName", "$ownerDetails.displayName"),
                Accumulators.first("ownerPhoneNumber", "$ownerDetails.phoneNumber"),
                Accumulators.first("brand", "$brand"),
                Accumulators.first("manufacturingYear", "$manufacturingYear"),
                Accumulators.first("washingPrice", "$washingPrice"),
                Accumulators.first("deodorisePrice", "$deodorisePrice")
        ));

        pipeline.add(Aggregates.project(Projections.fields(
                Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation", "mileageLimitPerDay", "extraMileageCharge", "extraHourlyCharge", "brand", "manufacturingYear", "washingPrice", "deodorisePrice"),
                Projections.computed("id", "$_id"),
                Projections.computed("owner.id", "$ownerId"),
                Projections.computed("owner.email", "$ownerEmail"),
                Projections.computed("owner.displayName", "$ownerDisplayName"),
                Projections.computed("owner.phoneNumber", "$ownerPhoneNumber"),
                Projections.computed("averageRating", "$averageRating")
        )));

        if (rating != null) {
            pipeline.add(Aggregates.match(Filters.and(
                    Filters.gte("averageRating", rating),
                    Filters.lt("averageRating", rating + 1.0)
            )));
        }

        if (pageable != null) {
            pipeline.add(Aggregates.skip((int) pageable.getOffset()));
            pipeline.add(Aggregates.limit(pageable.getPageSize()));
        }

        return pipeline;
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        MongoCollection<Document> collection = getCollection("cars");

        Bson finalQuery = buildSearchQuery(new SearchCriteria());
        Bson projection = Projections.fields(
                Projections.include("name"),
                Projections.excludeId()
        );

        FindIterable<Document> results = collection.find(finalQuery).projection(projection).limit(5);
        List<String> carNames = new ArrayList<>();
        for (Document result : results) {
            carNames.add(result.getString("name"));
        }
        return new ArrayList<>(new HashSet<>(carNames));
    }

    @Override
    public CarDetailDTO findByIdCustom(ObjectId id) {
        MongoCollection<Document> carCollection = getCollection("cars");

        Bson idFilter = Filters.eq("_id", id);
        List<Bson> pipeline = buildPipeline(idFilter, null, null, null, null);

        AggregateIterable<Document> carResults = carCollection.aggregate(pipeline);
        Document carResult = carResults.first();

        if (carResult == null) {
            return null; // or throw an exception
        }

        CarModel carModel = mapCarResultToModel(carResult);
        List<ReviewDTO> reviewDTOs = getReviewsForCar(id);
        List<CarDTO> relatedCars = getRelatedCars(id, carResult);

        return new CarDetailDTO(carModel, reviewDTOs, relatedCars);
    }

    private CarModel mapCarResultToModel(Document carResult) {
        CarModel carModel = modelMapper.map(carResult, CarModel.class);
        Document ownerDetails = (Document) carResult.get("owner");
        if (ownerDetails != null) {
            UserDTO userDTO = modelMapper.map(ownerDetails, UserDTO.class);
            carModel.setOwner(userDTO);
        }
        return carModel;
    }

    private List<ReviewDTO> getReviewsForCar(ObjectId carId) {
        MongoCollection<Document> reviewCollection = getCollection("reviews");
        Bson reviewFilter = Filters.and(Filters.eq("carId", carId), Filters.eq("reviewType", "CAR_REVIEW"));
        List<ReviewDTO> reviewDTOs = new ArrayList<>();
        Set<ObjectId> lesseeIds = new HashSet<>();
        for (Document review : reviewCollection.find(reviewFilter)) {
            reviewDTOs.add(new ReviewDTO(review));
            lesseeIds.add(review.getObjectId("lesseeId"));
        }
        populateLesseeDetails(lesseeIds, reviewDTOs);
        return reviewDTOs;
    }

    private void populateLesseeDetails(Set<ObjectId> lesseeIds, List<ReviewDTO> reviewDTOs) {
        MongoCollection<Document> userCollection = getCollection("users");
        Bson userFilter = Filters.in("_id", lesseeIds);
        FindIterable<Document> userResults = userCollection.find(userFilter);

        Map<String, UserDTO> userMap = new HashMap<>();
        for (Document userDocument : userResults) {
            UserDTO userDTO = new UserDTO(userDocument);
            userMap.put(userDocument.getObjectId("_id").toHexString(), userDTO);
        }

        for (ReviewDTO reviewDTO : reviewDTOs) {
            String lesseeId = reviewDTO.getLessee().getId();
            if (lesseeId != null) {
                UserDTO lesseeDTO = userMap.get(lesseeId);
                reviewDTO.setLessee(lesseeDTO);
            }
        }
    }

    private List<CarDTO> getRelatedCars(ObjectId id, Document carResult) {
        MongoCollection<Document> carCollection = getCollection("cars");
        Bson relatedCarsFilter = Filters.and(
                Filters.ne("_id", id),
                Filters.eq("province", carResult.getString("province")),
                Filters.eq("transmission", carResult.getString("transmission"))
        );

        List<CarDTO> relatedCars = new ArrayList<>();
        AggregateIterable<Document> relatedCarResults = carCollection.aggregate(Arrays.asList(
                Aggregates.match(relatedCarsFilter),
                Aggregates.project(Projections.fields(
                        Projections.computed("id", "$_id"),
                        Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation")
                )),
                Aggregates.limit(5)
        ));

        for (Document document : relatedCarResults) {
            relatedCars.add(modelMapper.map(document, CarDTO.class));
        }

        return relatedCars;
    }


    @Override
    public Page<CarDTO> search(SearchCriteria criteria, Pageable pageable) {
        MongoCollection<Document> collection = getCollection("cars");

        Bson finalQuery = buildSearchQuery(criteria);
        long totalItems = collection.countDocuments(finalQuery);
        List<Bson> pipeline = buildPipeline(finalQuery, pageable, new Date(criteria.getRentalStartDate()), new Date(criteria.getRentalEndDate()), criteria.getRating());

        List<CarDTO> carDTOs = new ArrayList<>();
        AggregateIterable<Document> searchResults = collection.aggregate(pipeline);
        for (Document result : searchResults) {
            CarDTO carDTO = modelMapper.map(result, CarDTO.class);
            carDTO.setOwner(modelMapper.map(result.get("owner"), UserDTO.class));
            carDTOs.add(carDTO);
        }

        return new PageImpl<>(carDTOs, pageable, totalItems);
    }

    @Override
    public Page<CarDTO> findByOwner(ObjectId ownerId, String searchQuery, Pageable pageable) {
        MongoCollection<Document> carCollection = getCollection("cars");

        Bson ownerFilter = Filters.eq("owner", ownerId);
        if (searchQuery != null && !searchQuery.isEmpty()) {
            Bson searchFilter = Filters.regex("name", searchQuery, "i"); // Case-insensitive search
            ownerFilter = Filters.and(ownerFilter, searchFilter);
        }

        Bson sort = pageable.getSort().stream()
                .map(order -> order.isAscending() ? Sorts.ascending(order.getProperty()) : Sorts.descending(order.getProperty()))
                .reduce(Sorts::orderBy)
                .orElse(Sorts.ascending("name"));

        List<Bson> pipeline = new ArrayList<>();
        pipeline.add(Aggregates.match(ownerFilter));
        pipeline.add(Aggregates.lookup("reviews", "_id", "carId", "reviews"));
        pipeline.add(Aggregates.unwind("$reviews", new UnwindOptions().preserveNullAndEmptyArrays(true)));
        pipeline.add(Aggregates.group(
                "$_id",
                Accumulators.avg("averageRating", "$reviews.rating"),
                Accumulators.first("name", "$name"),
                Accumulators.first("status", "$status"),
                Accumulators.first("imageUrl", "$imageUrl"),
                Accumulators.first("province", "$province"),
                Accumulators.first("location", "$location"),
                Accumulators.first("dailyRate", "$dailyRate"),
                Accumulators.first("seat", "$seat"),
                Accumulators.first("transmission", "$transmission"),
                Accumulators.first("fuel", "$fuel"),
                Accumulators.first("fuelConsumption", "$fuelConsumption"),
                Accumulators.first("description", "$description"),
                Accumulators.first("features", "$features"),
                Accumulators.first("color", "$color"),
                Accumulators.first("licensePlate", "$licensePlate"),
                Accumulators.first("registrationNumber", "$registrationNumber"),
                Accumulators.first("registrationDate", "$registrationDate"),
                Accumulators.first("registrationLocation", "$registrationLocation"),
                Accumulators.first("brand", "$brand"),
                Accumulators.first("manufacturingYear", "$manufacturingYear"),
                Accumulators.first("mileageLimitPerDay", "$mileageLimitPerDay"),
                Accumulators.first("extraMileageCharge", "$extraMileageCharge"),
                Accumulators.first("extraHourlyCharge", "$extraHourlyCharge"),
                Accumulators.first("washingPrice", "$washingPrice"),
                Accumulators.first("deodorisePrice", "$deodorisePrice")
        ));

        pipeline.add(Aggregates.sort(sort));
        pipeline.add(Aggregates.skip((int) pageable.getOffset()));
        pipeline.add(Aggregates.limit(pageable.getPageSize()));

        pipeline.add(Aggregates.project(Projections.fields(
                Projections.include("name", "status", "imageUrl", "province", "location", "dailyRate", "seat", "transmission", "fuel", "fuelConsumption", "description", "features", "color", "licensePlate", "registrationNumber", "registrationDate", "registrationLocation", "brand", "manufacturingYear", "mileageLimitPerDay", "extraMileageCharge", "extraHourlyCharge", "washingPrice", "deodorisePrice"),
                Projections.computed("id", "$_id"),
                Projections.computed("averageRating", "$averageRating")
        )));

        AggregateIterable<Document> ownerCarResults = carCollection.aggregate(pipeline);

        List<CarDTO> ownerCars = new ArrayList<>();
        for (Document document : ownerCarResults) {
            ownerCars.add(modelMapper.map(document, CarDTO.class));
        }

        long totalRecords = carCollection.countDocuments(ownerFilter);

        return new PageImpl<>(ownerCars, pageable, totalRecords);
    }

}