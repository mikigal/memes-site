package pl.mikigal.memes.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.mikigal.memes.data.dto.MemeDto;
import pl.mikigal.memes.data.dto.MemesListDto;
import pl.mikigal.memes.data.dto.ProfileDto;
import pl.mikigal.memes.data.dto.RestResponse;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.meme.MemeRepository;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.data.user.UserRepository;

import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class RootController {

    private final int memesPerPage;
    private final MemeRepository memeRepository;
    private final UserRepository userRepository;

    public RootController(@Value("${memes.memesPerPage}") int memesPerPage, MemeRepository memeRepository, UserRepository userRepository) {
        this.memesPerPage = memesPerPage;
        this.memeRepository = memeRepository;
        this.userRepository = userRepository;
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

    @GetMapping("/profile")
    public Object profile(@RequestParam int page, @RequestParam String username) {
        User user = this.userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(new RestResponse(false, "User with this username does not exists"));
        }

        return new ProfileDto(user, new MemesListDto((int) Math.ceil((double) user.getMemes().size() / this.memesPerPage),
                this.memeRepository.findWithOffsetByUser(this.memesPerPage, page * this.memesPerPage, user.getId())));
    }
}
