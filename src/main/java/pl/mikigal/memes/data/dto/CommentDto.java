package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.Comment;

@Getter
public class CommentDto {
    private final String author;
    private final int votes;
    private final String content;

    public CommentDto(Comment comment) {
        this.author = comment.getAuthor().getUsername();
        this.votes = comment.getVotes();
        this.content = comment.getContent();
    }
}
