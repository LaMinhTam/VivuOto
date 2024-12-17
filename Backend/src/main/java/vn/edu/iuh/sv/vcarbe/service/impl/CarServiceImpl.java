package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.CarDTO;
import vn.edu.iuh.sv.vcarbe.dto.CarDetailDTO;
import vn.edu.iuh.sv.vcarbe.dto.SearchCriteria;
import vn.edu.iuh.sv.vcarbe.entity.Car;
import vn.edu.iuh.sv.vcarbe.entity.CarStatus;
import vn.edu.iuh.sv.vcarbe.entity.Province;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.CarRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.CarService;
import vn.edu.iuh.sv.vcarbe.util.BeanUtils;
import vn.edu.iuh.sv.vcarbe.util.BlockchainUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CarServiceImpl implements CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BlockchainUtils blockchainUtils;
    @Autowired
    private UserRepository userRepository;

    @Override
    public CarDTO createCar(Car car) {
        car.setStatus(CarStatus.AVAILABLE);
        Car savedCar = carRepository.save(car);
        return modelMapper.map(savedCar, CarDTO.class);
    }

    public CarDTO updateCar(UserPrincipal userPrincipal, ObjectId id, Car car) {
        Car existingCar = carRepository.findByOwnerAndId(userPrincipal.getId(), id).orElseThrow(
                () -> new AppException(404, MessageKeys.CAR_NOT_FOUND.toString())
        );
        BeanUtils.copyNonNullProperties(car, existingCar);
        Car updatedCar = carRepository.save(existingCar);
        return modelMapper.map(updatedCar, CarDTO.class);
    }

    @Override
    public Car deleteCar(UserPrincipal userPrincipal, ObjectId id) {
        Car existingCar = carRepository.findByOwnerAndId(userPrincipal.getId(), id).orElseThrow(
                () -> new AppException(404, MessageKeys.CAR_NOT_FOUND.toString())
        );
        User owner = userRepository.findById(userPrincipal.getId()).orElseThrow(
                () -> new AppException(404, MessageKeys.USER_NOT_FOUND.toString())
        );
        if(owner.getMetamaskAddress() != null){
            blockchainUtils.sendSepoliaETH(owner.getMetamaskAddress(), BigDecimal.valueOf(0.05));
        }
        carRepository.delete(existingCar);
        return existingCar;
    }

    @Override
    public CarDetailDTO findCarById(ObjectId id) {
        return carRepository.findByIdCustom(id);
    }

    @Override
    public List<String> autocomplete(String query, Province province) {
        return carRepository.autocomplete(query, province);
    }

    @Override
    public Page<CarDTO> search(SearchCriteria criteria) {
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        return carRepository.search(criteria, pageable);
    }

    @Override
    public Page<CarDTO> getCarsByOwner(UserPrincipal userPrincipal, int page, int size, String sortField, boolean sortDescending, String searchQuery) {
        Pageable pageable = PageRequest.of(page, size, sortDescending ? Sort.Direction.DESC : Sort.Direction.ASC, sortField);
        return carRepository.findByOwner(userPrincipal.getId(), searchQuery, pageable);
    }
}
