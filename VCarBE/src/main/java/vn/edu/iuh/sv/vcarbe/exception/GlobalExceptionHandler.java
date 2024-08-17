package vn.edu.iuh.sv.vcarbe.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.edu.iuh.sv.vcarbe.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({AppException.class})
    public ResponseEntity<ApiResponse> handleExceptionA(AppException e) {
        return ResponseEntity.status(e.getCode()).body(new ApiResponse(e.getCode(), e.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnwantedException(Exception e) {
        log.error("Unknow error", e);
        return ResponseEntity.status(500).body(e.getMessage());
    }
}