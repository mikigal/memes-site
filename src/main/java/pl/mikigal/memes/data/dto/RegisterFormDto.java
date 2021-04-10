package pl.mikigal.memes.data.dto;

import lombok.Getter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@ToString
@Getter
public class RegisterFormDto {

    @Size(min = 6, max = 16)
    private String username;

    @Size(min = 6, max = 32)
    private String password;

    @Email
    private String mail;
}
