package pl.mikigal.memes.data.meme;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.List;

public interface MemeRepository extends CrudRepository<Meme, Integer> {

    @Query(value="SELECT * FROM memes ORDER BY upload_date DESC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Meme> findWithOffset(int limit, int offset);

    @Query(value="SELECT * FROM memes WHERE author_id = :authorId ORDER BY upload_date DESC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Meme> findWithOffsetByUser(int limit, int offset, int authorId);

    @Query(value="SELECT * FROM memes WHERE upload_date >= :since ORDER BY votes DESC LIMIT 3", nativeQuery = true)
    List<Meme> findMostPopularSince(Date since);

    @Query(value="SELECT COUNT(id) FROM memes", nativeQuery = true)
    int countMemes();
}
