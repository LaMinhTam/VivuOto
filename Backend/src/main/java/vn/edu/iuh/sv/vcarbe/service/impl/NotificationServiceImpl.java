package vn.edu.iuh.sv.vcarbe.service.impl;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.NotificationRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.service.NotificationService;
import vn.edu.iuh.sv.vcarbe.util.NotificationUtils;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationUtils notificationUtils;

    @Override
    public Page<NotificationDTO> getNotificationsForUser(ObjectId userId, int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.toUpperCase()), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Notification> notificationPage = notificationRepository.findByUserId(userId, pageable);
        List<NotificationDTO> notificationDTOs = notificationPage.map(notification -> modelMapper.map(notification, NotificationDTO.class)).getContent();
        return new PageImpl<>(notificationDTOs, pageable, notificationPage.getTotalElements());
    }


    @Override
    public NotificationDTO markAsRead(ObjectId notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new AppException(404, MessageKeys.NOTIFICATION_NOT_FOUND.name()));
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return modelMapper.map(notification, NotificationDTO.class);
    }

    @Override
    public User addDeviceToken(ObjectId id, String token) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));
        user.getDeviceTokens().add(token);
        return userRepository.save(user);
    }

    @Override
    public User removeDeviceToken(ObjectId id, String token) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));
        user.getDeviceTokens().remove(token);
        return userRepository.save(user);
    }

    @Override
    public NotificationDTO sendMessage(String deviceToken, String message) {
        notificationUtils.sendPushNotification(deviceToken, message, "this is the uri to the notification");
        return null;
    }
}
