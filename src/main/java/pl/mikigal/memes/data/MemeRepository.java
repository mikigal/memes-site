package pl.mikigal.memes.data;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MemeRepository extends CrudRepository<Meme, Integer> {

    @Query(value="SELECT * FROM Meme LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Meme> findWithOffset(int limit, int offset);

}
