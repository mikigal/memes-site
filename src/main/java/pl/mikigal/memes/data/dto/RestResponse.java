package pl.mikigal.memes.data.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RestResponse {
    private boolean success;
    private String message;
}
