package pl.mikigal.memes.data.comment;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.user.User;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private User author;

    @ManyToOne
    private Meme meme;

    @Column(length = 512)
    private String content;
    private int votes;

    private Date uploadDate;

    @OneToMany(mappedBy = "replyTo")
    private Set<Comment> replies;

    @ManyToOne
    private Comment replyTo;
    private boolean reply;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "vote_comments_plus",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> votedPlusUsers;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(name = "vote_comments_minus",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> votedMinusUsers;

    public Comment(User author, Meme meme, String content, Comment replyTo) {
        this.author = author;
        this.meme = meme;
        this.content = content;
        this.votes = 0;
        this.uploadDate = new Date();
        this.replies = new HashSet<>();
        this.replyTo = replyTo;
        this.reply = replyTo != null;
    }
}
