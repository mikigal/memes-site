package pl.mikigal.memes.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.mikigal.memes.data.dto.MemeDto;
import pl.mikigal.memes.data.dto.MemesListDto;
import pl.mikigal.memes.data.dto.RestResponse;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.meme.MemeRepository;

import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class RootController {

    private final int memesPerPage;
    private final MemeRepository memeRepository;
    public RootController(@Value("${memes.memesPerPage}") int memesPerPage, MemeRepository memeRepository) {
        this.memesPerPage = memesPerPage;
        this.memeRepository = memeRepository;
    }

    @GetMapping("/memes")
    public Object memes(@RequestParam int page) {
        if (page < 0) {
            return ResponseEntity.badRequest().body(new RestResponse(false, "invalid page id"));
        }

        return new MemesListDto((int) Math.ceil((double) this.memeRepository.countMemes() / this.memesPerPage),
                this.memeRepository.findWithOffset(this.memesPerPage, page * this.memesPerPage));
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

    /*@GetMapping("/temp")
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
    }*/
}
