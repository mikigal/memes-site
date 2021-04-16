package pl.mikigal.memes.data.notification;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.user.User;

import javax.persistence.*;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@ManyToOne
	private User user;

	@ManyToOne
	private Meme meme;

	private Date date;
	private String pingedBy;

	public Notification(User user, Meme meme, Date date, String pingedBy) {
		this.user = user;
		this.meme = meme;
		this.date = date;
		this.pingedBy = pingedBy;
	}
}
