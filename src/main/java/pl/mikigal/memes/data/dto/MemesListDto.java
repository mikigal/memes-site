package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.meme.Meme;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class MemesListDto {
	private int pages;
	private List<MemeDto> memes;

	public MemesListDto(int pages, List<Meme> memes) {
		this.pages = pages;
		this.memes = memes
				.stream()
				.map(meme -> new MemeDto(meme, false))
				.collect(Collectors.toList());
	}
}
