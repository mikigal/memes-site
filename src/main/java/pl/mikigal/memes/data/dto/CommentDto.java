package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.meme.Meme;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CommentDto {
    private final int id;
    private final String author;
    private final int votes;
    private final String content;
    private final long uploadDate;
    private final boolean isReply;
    private final List<CommentDto> replies;

    public CommentDto(Meme meme, Comment comment) {
        this.id = comment.getId();
        this.author = comment.getAuthor().getUsername();
        this.votes = comment.getVotes();
        this.content = comment.getContent();
        this.uploadDate = comment.getUploadDate().getTime();
        this.isReply = comment.isReply();

        if (comment.isReply()) {
            this.replies = null;
            return;
        }

        this.replies = meme.getComments()
                .stream()
                .filter(Comment::isReply)
                .filter(c -> c.getReplyTo().equals(comment))
                .map(c -> new CommentDto(meme, c))
                .sorted(Comparator.comparingLong(CommentDto::getUploadDate).reversed())
                .collect(Collectors.toList());
        }
}
