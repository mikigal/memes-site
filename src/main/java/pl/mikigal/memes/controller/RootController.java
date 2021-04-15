package pl.mikigal.memes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.comment.CommentRepository;
import pl.mikigal.memes.data.dto.*;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.meme.MemeRepository;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.data.user.UserRepository;
import pl.mikigal.memes.service.StorageService;
import pl.mikigal.memes.service.UploadType;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
public class RootController {

    private final UserRepository userRepository;
    private final MemeRepository memeRepository;
    private final CommentRepository commentRepository;
    private final StorageService storageService;

    public RootController(MemeRepository memeRepository,
                          UserRepository userRepository,
                          CommentRepository commentRepository,
                          StorageService storageService) {
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.storageService = storageService;
    }

    @GetMapping("/memes")
    public Object memes(@RequestParam int page) {
        if (page < 0) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid page id"));
        }

        return memeRepository.findWithOffset(10, page * 10)
                .stream()
                .map(meme -> new MemeDto(meme, false))
                .collect(Collectors.toList());
    }

    @GetMapping("/meme/{id}")
    public Object meme(@PathVariable int id) {
        Optional<Meme> meme = this.memeRepository.findById(id);
        if (!meme.isPresent()) {
            return ResponseEntity.status(404).body(new RestResponse(false, "invalid meme id"));
        }

        return new MemeDto(meme.get(), true);
    }

    @GetMapping("/recommendations")
    public Object recommendations() {
        return memeRepository.findMostPopularSince(new Date(System.currentTimeMillis() - 7 * 24 * 3600 * 1000))
                .stream()
                .map(meme -> new MemeDto(meme, false))
                .collect(Collectors.toList());
    }

    @PostMapping("/vote")
    public Object voteMeme(@RequestBody VoteDto vote, Authentication authentication) {
        User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
        }

        if (vote.isMeme()) {
            Optional<Meme> optional = this.memeRepository.findById(vote.getId());
            if (!optional.isPresent()) {
                return ResponseEntity.badRequest().body(new RestResponse(false, "invalid meme id"));
            }

            Meme meme = optional.get();
            int newState = user.vote(meme, vote.isPlus());
            meme = this.memeRepository.save(meme);

            return new VoteResponseDto(meme.getVotes(), newState);
        }

        Optional<Comment> optional = this.commentRepository.findById(vote.getId());
        if (!optional.isPresent()) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid comment id"));
        }

        Comment comment = optional.get();
        int newState = user.vote(comment, vote.isPlus());
        comment = commentRepository.save(comment);

        return new VoteResponseDto(comment.getVotes(), newState);
    }

    @GetMapping("/user")
    public Object user(Authentication authentication) {
        User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
        }

        return new UserDto(user);
    }

    @PostMapping("/upload_meme")
    public Object upload(@RequestParam("file") MultipartFile file, @RequestParam("title") String title, Authentication authentication) {
        User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
        }

        if (title.length() > 32) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "title too long"));
        }

        try {
            UUID image = this.storageService.store(UploadType.MEME, file.getBytes());
            this.memeRepository.save(new Meme(user, title, image));
            return new RestResponse(true, "success");
        } catch (IOException | IllegalStateException e) {
            return ResponseEntity.status(500).body(new RestResponse(false, "an error occurred while processing image"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new RestResponse(false, e.getMessage()));
        }
    }

    @PostMapping(value = "/comment")
    public ResponseEntity<?> comment(@Valid @RequestBody CommentFormDto commentForm, Authentication authentication) {
        User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
        if (user == null) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
        }

        Optional<Meme> memeOptional = this.memeRepository.findById(commentForm.getMemeId());
        if (!memeOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid meme id"));
        }

        Meme meme = memeOptional.get();
        boolean isReply = commentForm.getReplyTo() != -1;

        if (!isReply) {
            this.commentRepository.save(new Comment(user, meme, commentForm.getContent(), null));
            return ResponseEntity.ok().body(new RestResponse(true, "success"));
        }

        Optional<Comment> replyToOptional = this.commentRepository.findById(commentForm.getReplyTo());
        if (!replyToOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid replyTo id"));
        }

        Comment replyTo = replyToOptional.get();
        if (replyTo.isReply()) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "cant reply to another reply"));
        }

        this.commentRepository.save(new Comment(user, meme, commentForm.getContent(), replyTo));
        return ResponseEntity.ok().body(new RestResponse(true, "success"));
    }

    @GetMapping("/temp")
    public Object temp() {
        User mikigal = new User("mikigal", new BCryptPasswordEncoder().encode("zaq1@WSX"), "mikigal.priv@gmail.com");
        mikigal.setAvatar(UUID.fromString("7064addd-ccde-4222-ac29-68e7332baf6d"));
        mikigal = this.userRepository.save(mikigal);

        User socket = new User("SocketByte", new BCryptPasswordEncoder().encode("zaq1@WSX"), "a01@mikigal.pl");
        socket.setAvatar(UUID.fromString("c1e5f057-17d1-4e50-a5e6-3d78e3a4e3f8"));
        socket = this.userRepository.save(socket);

        Meme first = this.memeRepository.save(new Meme(mikigal, "First meme", UUID.fromString("d73e1522-452b-40ef-bd3f-6dd5dd3749b8")));
        Meme second = this.memeRepository.save(new Meme(mikigal, "Second meme", UUID.fromString("54a33173-4954-4697-9857-dd15f53323e6")));
        Meme third = this.memeRepository.save( new Meme(socket, "Third meme", UUID.fromString("fb2f9e61-ef9f-40eb-95bc-c8da39f9c82b")));

        Comment firstComment = this.commentRepository.save(
                new Comment(socket, third, "Therefore, database queries may be performed during view rendering. Explicitly configure", null));
        Comment secondComment = this.commentRepository.save(
                new Comment(socket, third, "Finished Spring Data repository scanning in 33 ms. Found 3 JPA repository interfaces.", null));
        Comment reply = this.commentRepository.save(new Comment(mikigal, third, "It's reply!", secondComment));

        return "succ";
    }
}
