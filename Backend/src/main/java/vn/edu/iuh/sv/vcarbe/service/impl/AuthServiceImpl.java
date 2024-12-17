package vn.edu.iuh.sv.vcarbe.service.impl;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.AuthProvider;
import vn.edu.iuh.sv.vcarbe.entity.Role;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import vn.edu.iuh.sv.vcarbe.exception.InternalServerErrorException;
import vn.edu.iuh.sv.vcarbe.exception.InvalidCredentialsException;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.repository.RoleRepository;
import vn.edu.iuh.sv.vcarbe.repository.UserRepository;
import vn.edu.iuh.sv.vcarbe.security.TokenProvider;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;
import vn.edu.iuh.sv.vcarbe.util.MailSenderHelper;

import java.io.UnsupportedEncodingException;
import java.time.Duration;
import java.util.Calendar;
import java.util.Date;
import java.util.Set;

@Service
public class AuthServiceImpl implements Authservice {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private MailSenderHelper mailSenderHelper;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public SignInResponse authenticateUser(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String accessToken = tokenProvider.accessToken(userPrincipal);
            String refreshToken = tokenProvider.refreshToken(userPrincipal);

            return new SignInResponse(
                    userPrincipal.getId().toHexString(),
                    userPrincipal.getDisplayName(),
                    userPrincipal.getUsername(),
                    userPrincipal.getImageUrl(),
                    userPrincipal.getPhoneNumber(),
                    accessToken,
                    refreshToken
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("BAD_CREDENTIALS");
        } catch (DisabledException ex) {
            throw new InvalidCredentialsException("USER_DISABLED");
        }
    }


    public User registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new AppException(400, MessageKeys.EMAIL_IN_USE.name());
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setImageUrl("https://source.unsplash.com/random");
        user.setDisplayName(signUpRequest.getName());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Set.of(roleRepository.findByName("ROLE_USER")));
        User result = userRepository.save(user);
        try {
            mailSenderHelper.sendVerificationEmail(user.getEmail(), verificationCode);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new InternalServerErrorException("Failed to send verification email");
        }

        return result;
    }


    @Override
    public TokenResponse refreshToken(UserPrincipal userPrincipal, String oldRefreshToken) {
        if (redisTemplate.opsForValue().get(oldRefreshToken) != null) {
            throw new AppException(400, MessageKeys.REFRESH_TOKEN_USED.name());
        }
        redisTemplate.opsForValue().set(oldRefreshToken, true, Duration.ofMinutes(tokenProvider.getRefreshTokenExpiryMinutes()));

        String accessToken = tokenProvider.accessToken(userPrincipal);
        String refreshToken = tokenProvider.refreshToken(userPrincipal);
        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public SignInResponse verifyUser(VerificationRequest verificationRequest) {
        User user = userRepository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new AppException(400, MessageKeys.USER_NOT_FOUND.name()));
        if (user.getEmailVerified()) {
            throw new AppException(400, MessageKeys.EMAIL_ALREADY_VERIFIED.name());
        }
        if (!user.getVerificationCode().equals(verificationRequest.getVerificationCode())) {
            throw new AppException(400, MessageKeys.VERIFICATION_CODE_INVALID.name());
        }
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        return new SignInResponse(
                user.getId().toHexString(),
                user.getDisplayName(),
                user.getEmail(),
                user.getImageUrl(),
                user.getPhoneNumber(),
                tokenProvider.accessToken(userPrincipal),
                tokenProvider.refreshToken(userPrincipal)
        );
    }


    public User updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.toString()));

        user.setPhoneNumber(updatePhoneRequest.phone());
        return userRepository.save(user);
    }

    @Override
    public void changePassword(UserPrincipal userPrincipal, ChangePasswordRequest request) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(400, MessageKeys.INVALID_OLD_PASSWORD.name());
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void sendPasswordResetOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));

        String otp = generateVerificationCode();
        user.setPasswordResetCode(otp);
        user.setPasswordResetCodeExpiry(calculateExpiryTime(10));
        userRepository.save(user);
        try {
            mailSenderHelper.sendVerificationEmail(email, otp);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new AppException(500, MessageKeys.OTP_SEND_FAILED.name());
        }
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(404, MessageKeys.USER_NOT_FOUND.name()));
        try{
            if (user.getPasswordResetCode().equals(request.getOtp()) && user.getPasswordResetCodeExpiry().after(new Date())) {
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                user.setPasswordResetCodeExpiry(null);
                user.setPasswordResetCode(null);
                userRepository.save(user);
            }else{
                throw new AppException(400, MessageKeys.INVALID_OTP.name());
            }
        }catch (Exception e){
            throw new AppException(400, MessageKeys.INVALID_OTP.name());
        }
    }

    private String generateVerificationCode() {
        return String.valueOf((int) ((Math.random() * 90000) + 10000));
    }

    public static Date calculateExpiryTime(int minutesToAdd) {
        Date currentTime = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentTime);
        calendar.add(Calendar.MINUTE, minutesToAdd);
        return calendar.getTime();
    }

}
