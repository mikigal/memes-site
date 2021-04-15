package pl.mikigal.memes.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CommentFormDto {
    private int memeId;
    private int replyTo;

    @NotEmpty
    @Size(min = 5, max = 512)
    private String content;
}
