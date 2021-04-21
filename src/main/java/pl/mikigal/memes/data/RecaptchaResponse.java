package pl.mikigal.memes.data;

import lombok.Getter;

@Getter
public class RecaptchaResponse {
	private boolean success;
	private String challenge_ts;
	private String hostname;
}
