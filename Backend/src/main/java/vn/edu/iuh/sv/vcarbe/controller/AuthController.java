package vn.edu.iuh.sv.vcarbe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.iuh.sv.vcarbe.dto.*;
import vn.edu.iuh.sv.vcarbe.exception.MessageKeys;
import vn.edu.iuh.sv.vcarbe.security.UserPrincipal;
import vn.edu.iuh.sv.vcarbe.service.Authservice;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth Controller", description = "APIs related to user authentication and management")
public class AuthController {
    @Autowired
    private Authservice authService;

    @Operation(summary = "Sign in user", description = "Authenticates a user and returns access and refresh tokens")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid email or password")
    })
    @PostMapping("/signin")
    public ResponseEntity<ApiResponseWrapper> authenticateUser(
            @RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_AUTHEN_SUCCESS.name(), authService.authenticateUser(loginRequest)));
    }

    @Operation(summary = "Sign up user", description = "Registers a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Email address already in use")
    })
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseWrapper> registerUser(
            @RequestBody @Valid SignUpRequest signUpRequest) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_REGISTER_SUCCESS.name(), authService.registerUser(signUpRequest)));
    }

    @Operation(summary = "Refresh token", description = "Refreshes the access token using the provided refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseWrapper> refreshToken(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            HttpServletRequest req) {
        String refreshToken = req.getHeader("authorization").substring(7);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.REFRESH_TOKEN_SUCCESS.name(), authService.refreshToken(userPrincipal, refreshToken)));
    }

    @Operation(summary = "Verify user", description = "Verifies a user's email address with a verification code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid verification code or user not found")
    })
    @PostMapping("/verify")
    public ResponseEntity<ApiResponseWrapper> verifyUser(
            @RequestBody @Valid VerificationRequest verificationRequest) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_VERIFY_SUCCESS.name(), authService.verifyUser(verificationRequest)));
    }

    @Operation(summary = "Update phone number", description = "Updates the phone number for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Phone number updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/update-phone")
    public ResponseEntity<ApiResponseWrapper> updatePhoneNumber(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid UpdatePhoneRequest updatePhoneRequest) {
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.USER_PHONE_UPDATE_SUCCESS.name(), authService.updatePhoneNumber(userPrincipal, updatePhoneRequest)));
    }

    @Operation(summary = "Change password", description = "Changes the password for the authenticated user")
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponseWrapper> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
        authService.changePassword(userPrincipal, changePasswordRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PASSWORD_CHANGE_SUCCESS.name(), null));
    }

    @Operation(summary = "Forgot password", description = "Initiates the forgot password process by sending an OTP to the user's email")
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponseWrapper> forgotPassword(
            @RequestBody @Valid ForgotPasswordRequest forgotPasswordRequest) {
        authService.sendPasswordResetOtp(forgotPasswordRequest.getEmail());
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.OTP_SENT.name(), null));
    }

    @Operation(summary = "Reset password", description = "Resets the password using an OTP sent to the user's email")
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponseWrapper> resetPassword(
            @RequestBody @Valid ResetPasswordRequest resetPasswordRequest) {
        authService.resetPassword(resetPasswordRequest);
        return ResponseEntity.ok(new ApiResponseWrapper(200, MessageKeys.PASSWORD_RESET_SUCCESS.name(), null));
    }
}
