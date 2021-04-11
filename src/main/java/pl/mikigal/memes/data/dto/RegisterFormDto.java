package pl.mikigal.memes.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

@Getter
@AllArgsConstructor
public class RegisterFormDto {

    @Size(min = 6, max = 16)
    private final String username;

    @Size(min = 6, max = 32)
    private final String password;

    @Email
    private final String mail;
}
