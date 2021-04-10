package pl.mikigal.memes.data.meme;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MemeRepository extends CrudRepository<Meme, Integer> {

    @Query(value="SELECT * FROM meme ORDER BY upload_date DESC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Meme> findWithOffset(int limit, int offset);

    @Query(value="SELECT * FROM meme ORDER BY votes DESC LIMIT :limit", nativeQuery = true)
    List<Meme> findMostPopular(int limit);
}
