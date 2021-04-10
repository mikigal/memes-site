package pl.mikigal.memes.data.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import pl.mikigal.memes.data.meme.Meme;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@ToString
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String username;
    private String password;
    private String mail;

    @OneToMany
    private List<Meme> memes;

    public User(String username, String password, String mail) {
        this.username = username;
        this.password = password;
        this.mail = mail;
        this.memes = new ArrayList<>();
    }
}
