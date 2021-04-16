package pl.mikigal.memes.data.meme;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.notification.Notification;
import pl.mikigal.memes.data.user.User;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "memes")
public class Meme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private UUID image;

    @ManyToOne
    private User author;

    private String title;
    private Date uploadDate;
    private int votes;

    @OneToMany(mappedBy = "meme")
    private Set<Comment> comments;

    @OneToMany(mappedBy = "meme")
    private Set<Notification> notifications;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "vote_memes_plus",
            joinColumns = @JoinColumn(name = "meme_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> votedPlusUsers;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "vote_memes_minus",
            joinColumns = @JoinColumn(name = "meme_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> votedMinusUsers;

    public Meme(User author, String title, UUID image) {
        this.image = image;
        this.author = author;
        this.title = title;
        this.uploadDate = new Date();
        this.votes = 0;
        this.comments = new HashSet<>();
    }
}
