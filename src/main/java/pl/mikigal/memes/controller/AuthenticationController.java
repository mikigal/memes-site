package pl.mikigal.memes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.mikigal.memes.data.dto.RegisterFormDto;
import pl.mikigal.memes.data.dto.RestResponse;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.data.user.UserRepository;
import pl.mikigal.memes.service.RecaptchaValidationService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
public class AuthenticationController {

    private final UserRepository userRepository;
    private final RecaptchaValidationService recaptchaValidationService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationController(UserRepository userRepository,
                                    RecaptchaValidationService recaptchaValidationService,
                                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.recaptchaValidationService = recaptchaValidationService;
    }

    @PostMapping("/register")
    public Object register(@Valid @RequestBody RegisterFormDto registerForm, HttpServletRequest request, Authentication authentication) {
        if (!this.recaptchaValidationService.validate(registerForm.getCaptchaToken())) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "Are you a robot?"));
        }

        if (authentication != null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "You are already logged in"));
        }

        if (this.userRepository.findByUsername(registerForm.getUsername()) != null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "User with this username already exists"));
        }

        if (this.userRepository.findByMail(registerForm.getMail()) != null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "User with this mail address already exists"));
        }

        if (!registerForm.getPassword().equals(registerForm.getRepeatPassword())) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "Password are not the same"));
        }

        this.userRepository.save(new User(registerForm.getUsername(),
                this.passwordEncoder.encode(registerForm.getPassword().trim()),
                registerForm.getMail())
        );

        try {
            request.login(registerForm.getUsername(), registerForm.getPassword());
        } catch (ServletException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new RestResponse(false, "Can not login after registration"));
        }

        return ResponseEntity.ok().body(new RestResponse(true, "Success"));
    }

}
