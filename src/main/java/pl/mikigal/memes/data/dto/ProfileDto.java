package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.user.User;

import java.util.Date;
import java.util.UUID;

@Getter
public class ProfileDto {
	private final String username;
	private final Date registerDate;
	private final UUID avatar;
	private final int memesAmount;
	private final int commentsAmount;

	private final MemesListDto memesList;

	public ProfileDto(User user, MemesListDto memesList) {
		this.username = user.getUsername();
		this.registerDate = user.getRegisterDate();
		this.avatar = user.getAvatar();
		this.memesAmount = user.getMemes().size();
		this.commentsAmount = user.getComments().size();
		this.memesList = memesList;
	}
}
