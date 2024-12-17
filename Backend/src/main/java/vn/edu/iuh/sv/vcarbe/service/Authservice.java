package vn.edu.iuh.sv.vcarbe.service;

import vn.edu.iuh.sv.vcarbe.dto.TokenResponse;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.entity.User;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;

public interface Authservice {
    SignInResponse authenticateUser(LoginRequest loginRequest);

    User registerUser(SignUpRequest signUpRequest);

    TokenResponse refreshToken(UserPrincipal userPrincipal, String oldRefreshToken);

    SignInResponse verifyUser(VerificationRequest verificationRequest);

    User updatePhoneNumber(UserPrincipal userPrincipal, UpdatePhoneRequest updatePhoneRequest);

    void changePassword(UserPrincipal userPrincipal, ChangePasswordRequest changePasswordRequest);

    void sendPasswordResetOtp(String email);

    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
