package vn.edu.iuh.sv.vcarbe.util;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import vn.edu.iuh.sv.vcarbe.entity.Notification;
import vn.edu.iuh.sv.vcarbe.entity.NotificationMessage;
import vn.edu.iuh.sv.vcarbe.entity.NotificationType;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.repository.NotificationRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

@Component
public class NotificationUtils {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Value("${vcar.icon}")
    private String icon;

    public void createNotification(ObjectId userId, NotificationMessage message, NotificationType type, String link, ObjectId targetId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notification.setLink(link);
        notification.setRead(false);
        notification.setCreatedAt(new Date());
        notification.setTargetId(targetId);

        notificationRepository.save(notification);
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Set<String> deviceTokens = user.getDeviceTokens();

            for (String fcmToken : deviceTokens) {
                sendPushNotification(fcmToken, message.name(), link);
            }
        }

    }


    public void sendPushNotification(String fcmToken, String message, String link) {
        com.google.firebase.messaging.Notification notification = com.google.firebase.messaging.Notification.builder()
                .setTitle("VCar here!")
                .setBody(message)
                .setImage(icon)
                .build();

        Message firebaseMessage = com.google.firebase.messaging.Message.builder()
                .setToken(fcmToken)
                .setNotification(notification)
                .putData("link", link)
                .build();

        try {
            FirebaseMessaging.getInstance().send(firebaseMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
