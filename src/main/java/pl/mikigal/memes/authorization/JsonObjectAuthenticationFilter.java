package pl.mikigal.memes.authorization;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.mikigal.memes.service.RecaptchaValidationService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

public class JsonObjectAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final RecaptchaValidationService recaptchaValidationService;
    private final ObjectMapper mapper = new ObjectMapper();

    public JsonObjectAuthenticationFilter(RecaptchaValidationService recaptchaValidationService) {
        this.recaptchaValidationService = recaptchaValidationService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            BufferedReader reader = request.getReader();
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }

            LoginCredentials credentials = this.mapper.readValue(builder.toString(), LoginCredentials.class);
            if (!this.recaptchaValidationService.validate(credentials.getCaptchaToken())) {
                response.setStatus(400);
                return null;
            }

            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(credentials.getUsername(), credentials.getPassword());

            this.setDetails(request, token);
            return this.getAuthenticationManager().authenticate(token);
        } catch (IOException e) {
            throw new AuthenticationServiceException("an error occurred while processing login request", e);
        }
    }
}
