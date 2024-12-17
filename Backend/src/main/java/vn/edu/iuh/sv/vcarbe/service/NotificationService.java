package vn.edu.iuh.sv.vcarbe.service;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import vn.edu.iuh.sv.vcarbe.dto.NotificationDTO;
import vn.edu.iuh.sv.vcarbe.entity.User;

public interface NotificationService {
    Page<NotificationDTO> getNotificationsForUser(ObjectId userId, int page, int size, String sortBy, String sortDir);

    NotificationDTO markAsRead(ObjectId notificationId);

    User addDeviceToken(ObjectId id, String deviceToken);

    User removeDeviceToken(ObjectId id, String token);

    NotificationDTO sendMessage(String deviceToken, String message);
}
