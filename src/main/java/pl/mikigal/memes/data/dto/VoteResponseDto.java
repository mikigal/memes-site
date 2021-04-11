package pl.mikigal.memes.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoteResponseDto {
    private final int newVotes;
    private final int newState;
}
