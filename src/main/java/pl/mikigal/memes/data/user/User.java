package pl.mikigal.memes.data.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.meme.Meme;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String username;
    private String password;
    private String mail;

    private String avatar;

    @OneToMany(mappedBy = "author")
    private Set<Meme> memes;

    @OneToMany(mappedBy = "author")
    private Set<Comment> comments;

    @ManyToMany(mappedBy = "votedPlusUsers")
    private Set<Comment> votedPlusComments;

    @ManyToMany(mappedBy = "votedMinusUsers")
    private Set<Comment> votedMinusComments;

    @ManyToMany(mappedBy = "votedPlusUsers")
    private Set<Meme> votedPlusMemes;

    @ManyToMany(mappedBy = "votedMinusUsers")
    private Set<Meme> votedMinusMemes;

    public User(String username, String password, String mail) {
        this.username = username;
        this.password = password;
        this.mail = mail;
        this.memes = new HashSet<>();
    }

    public int vote(Meme meme, boolean plus) {
        if (plus) {
            if (this.votedMinusMemes.contains(meme)) {
                this.votedMinusMemes.remove(meme);
                meme.getVotedMinusUsers().remove(this);

                this.votedPlusMemes.add(meme);
                meme.getVotedPlusUsers().add(this);

                meme.setVotes(meme.getVotes() + 2);

                return 1;
            }
            else if (this.votedPlusMemes.contains(meme)) {
                this.votedPlusMemes.remove(meme);
                meme.getVotedPlusUsers().remove(this);
                meme.setVotes(meme.getVotes() - 1);

                return -1;
            }
            else {
                this.votedPlusMemes.add(meme);
                meme.getVotedPlusUsers().add(this);
                meme.setVotes(meme.getVotes() + 1);

                return 1;
            }
        }

        // Minus
        if (this.votedPlusMemes.contains(meme)) {
            this.votedPlusMemes.remove(meme);
            meme.getVotedPlusUsers().remove(this);

            this.votedMinusMemes.add(meme);
            meme.getVotedMinusUsers().add(this);

            meme.setVotes(meme.getVotes() - 2);
            return 0;
        }
        else if (this.votedMinusMemes.contains(meme)) {
            this.votedMinusMemes.remove(meme);
            meme.getVotedMinusUsers().remove(this);

            meme.setVotes(meme.getVotes() + 1);
            return -1;
        }
        else {
            this.votedMinusMemes.add(meme);
            meme.getVotedMinusUsers().add(this);

            meme.setVotes(meme.getVotes() - 1);
            return 0;
        }
    }

    public int vote(Comment comment, boolean plus) {
        if (plus) {
            if (this.votedMinusComments.contains(comment)) {
                this.votedMinusComments.remove(comment);
                comment.getVotedMinusUsers().remove(this);

                this.votedPlusComments.add(comment);
                comment.getVotedPlusUsers().add(this);

                comment.setVotes(comment.getVotes() + 2);
                return 1;
            }
            else if (this.votedPlusComments.contains(comment)) {
                this.votedPlusComments.remove(comment);
                comment.getVotedPlusUsers().remove(this);
                comment.setVotes(comment.getVotes() - 1);
                return -1;
            }
            else {
                this.votedPlusComments.add(comment);
                comment.getVotedPlusUsers().add(this);
                comment.setVotes(comment.getVotes() + 1);
                return 1;
            }
        }

        // Minus
        if (this.votedPlusComments.contains(comment)) {
            this.votedPlusComments.remove(comment);
            comment.getVotedPlusUsers().remove(this);

            this.votedMinusComments.add(comment);
            comment.getVotedMinusUsers().add(this);

            comment.setVotes(comment.getVotes() - 2);
            return 0;
        }
        else if (this.votedMinusComments.contains(comment)) {
            this.votedMinusComments.remove(comment);
            comment.getVotedMinusUsers().remove(this);

            comment.setVotes(comment.getVotes() + 1);
            return -1;
        }
        else {
            this.votedMinusComments.add(comment);
            comment.getVotedMinusUsers().add(this);

            comment.setVotes(comment.getVotes() - 1);
            return 0;
        }
    }
}
