package pl.mikigal.memes.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class VoteDto {
    private final int id;
    private final boolean meme;
    private final boolean plus;
}
