package pl.mikigal.memes.data.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.mikigal.memes.data.Votable;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.notification.Notification;

import javax.persistence.*;
import java.util.*;

@Getter
@Setter
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
    private Date registerDate;

    private UUID avatar;

    @OneToMany(mappedBy = "author")
    private Set<Meme> memes;

    @OneToMany(mappedBy = "author")
    private Set<Comment> comments;

    @OneToMany(mappedBy = "user")
    private Set<Notification> notifications;

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
        this.registerDate = new Date();
        this.memes = new HashSet<>();
        this.comments = new HashSet<>();
        this.notifications = new HashSet<>();
    }

    public Set getVotedPlus(Votable votable) {
        return votable instanceof Meme ? this.votedPlusMemes : this.votedPlusComments;
    }

    public Set getVotedMinus(Votable votable) {
        return votable instanceof Meme? this.votedMinusMemes : this.votedMinusComments;
    }

    public int vote(Votable votable, boolean plus) {
        if (plus) {
            if (this.getVotedMinus(votable).contains(votable)) {
                this.getVotedMinus(votable).remove(votable);
                votable.getVotedMinusUsers().remove(this);

                this.getVotedPlus(votable).add(votable);
                votable.getVotedPlusUsers().add(this);

                votable.setVotes(votable.getVotes() + 2);

                return 1;
            }
            else if (this.getVotedPlus(votable).contains(votable)) {
                this.getVotedPlus(votable).remove(votable);
                votable.getVotedPlusUsers().remove(this);
                votable.setVotes(votable.getVotes() - 1);

                return -1;
            }
            else {
                this.getVotedPlus(votable).add(votable);
                votable.getVotedPlusUsers().add(this);
                votable.setVotes(votable.getVotes() + 1);

                return 1;
            }
        }

        // Minus
        if (this.getVotedPlus(votable).contains(votable)) {
            this.getVotedPlus(votable).remove(votable);
            votable.getVotedPlusUsers().remove(this);

            this.getVotedMinus(votable).add(votable);
            votable.getVotedMinusUsers().add(this);

            votable.setVotes(votable.getVotes() - 2);
            return 0;
        }
        else if (this.getVotedMinus(votable).contains(votable)) {
            this.getVotedMinus(votable).remove(votable);
            votable.getVotedMinusUsers().remove(this);

            votable.setVotes(votable.getVotes() + 1);
            return -1;
        }
        else {
            this.getVotedMinus(votable).add(votable);
            votable.getVotedMinusUsers().add(this);

            votable.setVotes(votable.getVotes() - 1);
            return 0;
        }
    }
}
