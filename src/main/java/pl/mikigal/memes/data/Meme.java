package pl.mikigal.memes.data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class Meme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String image;

    @ManyToOne
    private User author;
    private String title;
    private Date uploadDate;
    private int votes;

    @OneToMany
    private List<Comment> comments;

    @OneToMany
    private List<User> votedUsers;

    public Meme(User author, String title, String image) {
        this.image = image;
        this.author = author;
        this.title = title;
        this.uploadDate = new Date();
        this.votes = 0;
        this.comments = new ArrayList<>();
    }
}
