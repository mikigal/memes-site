package pl.mikigal.memes.authorization;

import lombok.Getter;

@Getter
public class LoginCredentials {

    private String username;
    private String password;
    private String captchaToken;
}
