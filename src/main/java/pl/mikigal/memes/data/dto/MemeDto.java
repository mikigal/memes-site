package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.meme.Meme;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class MemeDto {
    private final int id;
    private final String image;
    private final String author;
    private final String title;
    private final long uploadDate;
    private final int votes;
    private final List<CommentDto> comments;

    public MemeDto(Meme meme) {
        this.id = meme.getId();
        this.image = meme.getImage();
        this.author = meme.getAuthor().getUsername();
        this.title = meme.getTitle();
        this.uploadDate = meme.getUploadDate().getTime();
        this.votes = meme.getVotes();
        this.comments = meme.getComments().stream()
                .map(CommentDto::new)
                .collect(Collectors.toList());
    }
}
