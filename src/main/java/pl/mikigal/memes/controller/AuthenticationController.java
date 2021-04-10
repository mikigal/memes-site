package pl.mikigal.memes.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.mikigal.memes.data.dto.RegisterFormDto;
import pl.mikigal.memes.data.User;
import pl.mikigal.memes.data.UserRepository;
import pl.mikigal.memes.exception.UserRegisterException;

import javax.validation.Valid;

@RestController
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/register")
    public Object register(@Valid @RequestBody RegisterFormDto registerForm) throws UserRegisterException {
        if (this.userRepository.findByUsername(registerForm.getUsername()) != null) {
            throw new UserRegisterException("User with this username already exists");
        }

        if (this.userRepository.findByMail(registerForm.getMail()) != null) {
            throw new UserRegisterException("User with this mail already exists");
        }

        User user = new User(registerForm.getUsername(),
                this.passwordEncoder.encode(registerForm.getPassword()),
                registerForm.getMail()
        );

        user = this.userRepository.save(user);
        return user.getId();
    }

}
