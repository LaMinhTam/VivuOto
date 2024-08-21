package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

import java.util.List;

public interface CarService {
    CarDTO createCar(Car car);

    CarDTO updateCar(UserPrincipal userPrincipal, ObjectId id, Car car);

    void deleteCar(UserPrincipal userPrincipal, ObjectId id);

    CarDetailDTO findCarById(ObjectId id);

    List<String> autocomplete(String query, Province province);

    List<CarDTO> search(SearchCriteria criteria);
}
