package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.notification.Notification;

import java.util.Date;
import java.util.UUID;

@Getter
public class NotificationDto {
	private final int id;
	private final int memeId;
	private final UUID memeImage;
	private final Date date;
	private final String pingedBy;

	public NotificationDto(Notification notification) {
		this.id = notification.getId();
		this.memeId = notification.getMeme().getId();
		this.memeImage = notification.getMeme().getImage();
		this.date = notification.getDate();
		this.pingedBy = notification.getPingedBy();
	}
}
