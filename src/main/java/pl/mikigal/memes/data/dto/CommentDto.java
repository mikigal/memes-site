package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.comment.Comment;

@Getter
public class CommentDto {
    private final int id;
    private final String author;
    private final int votes;
    private final String content;
    private final long uploadDate;

    public CommentDto(Comment comment) {
        this.id = comment.getId();
        this.author = comment.getAuthor().getUsername();
        this.votes = comment.getVotes();
        this.content = comment.getContent();
        this.uploadDate = comment.getUploadDate().getTime();
    }
}
