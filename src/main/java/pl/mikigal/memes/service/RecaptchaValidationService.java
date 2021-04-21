package pl.mikigal.memes.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import pl.mikigal.memes.data.RecaptchaResponse;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;

@Service
public class RecaptchaValidationService {

	private final ObjectMapper mapper = new ObjectMapper();
	private final String recaptchaSecret;

	public RecaptchaValidationService(@Value("${memes.recaptchaSecret}") String recaptchaSecret) {
		this.recaptchaSecret = recaptchaSecret;
	}

	/**
	 * Validates clients response with Google ReCAPTCHA V3 API
	 * @param clientResponse response from the client
	 * @return true if response in valid, else false
	 */
	public boolean validate(String clientResponse) {
		try {
			URL url = new URL("https://www.google.com/recaptcha/api/siteverify");
			HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.setDoOutput(true);

			DataOutputStream stream = new DataOutputStream(connection.getOutputStream());
			stream.writeBytes("secret=" + this.recaptchaSecret + "&response=" + clientResponse);
			stream.flush();
			stream.close();

			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String inputLine;
			StringBuilder responseBuilder = new StringBuilder();
			while ((inputLine = reader.readLine()) != null) {
				responseBuilder.append(inputLine);
			}
			reader.close();

			RecaptchaResponse response = this.mapper.readValue(responseBuilder.toString(), RecaptchaResponse.class);
			return response.isSuccess();
		} catch (UnrecognizedPropertyException e) {
			return false;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
