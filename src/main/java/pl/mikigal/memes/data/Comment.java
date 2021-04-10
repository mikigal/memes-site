package pl.mikigal.memes.data;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    private User author;

    @ManyToOne
    private Meme meme;

    private String content;
    private int votes;

    @OneToMany
    private List<User> votedUsers;

    public Comment(User author, Meme meme, String content) {
        this.author = author;
        this.meme = meme;
        this.content = content;
    }
}
