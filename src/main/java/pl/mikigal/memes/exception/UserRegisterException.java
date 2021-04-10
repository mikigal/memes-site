package pl.mikigal.memes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UserRegisterException extends RuntimeException {

    public UserRegisterException(String message) {
        super(message);
    }
}
