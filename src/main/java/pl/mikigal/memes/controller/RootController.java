package pl.mikigal.memes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.comment.CommentRepository;
import pl.mikigal.memes.data.dto.MemeDto;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.meme.MemeRepository;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.data.user.UserRepository;

import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class RootController {

    private final UserRepository userRepository;
    private final MemeRepository memeRepository;
    private final CommentRepository commentRepository;

    public RootController(MemeRepository memeRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @GetMapping("/memes")
    public Object memes(@RequestParam int page) {
        if (page < 0) {
            return ResponseEntity.badRequest().body(null);
        }

        return memeRepository.findWithOffset(10, page * 10)
                .stream()
                .map(MemeDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/meme/{id}")
    public Object meme(@PathVariable int id) {
        Optional<Meme> meme = this.memeRepository.findById(id);
        if (!meme.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }

        return new MemeDto(meme.get());
    }

    @GetMapping("/most_popular")
    public Object mostPopular() {
        return memeRepository.findMostPopular(10)
                .stream()
                .map(MemeDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/user")
    public Object user() {
        return "{\"x\": \"something\"}";
    }

    @GetMapping("/temp")
    public Object temp() {
        User user = new User("mikigal", new BCryptPasswordEncoder().encode("zaq1@WSX"), "mikigal.priv@gmail.com");
        user = userRepository.save(user);

        User second = new User("SocketByte", new BCryptPasswordEncoder().encode("zaq1@WSX"), "a01@mikigal.pl");
        second = userRepository.save(second);

        Meme meme = new Meme(user, "Example meme", "54a33173-4954-4697-9857-dd15f53323e6.png");
        meme = memeRepository.save(meme);

        Comment comment = new Comment(second, meme, "Twoj stary pijany odbija sie od sciany");
        comment = commentRepository.save(comment);

        meme.getComments().add(comment);
        meme = memeRepository.save(meme);

        return "success";
    }
}
