package pl.mikigal.memes.data.user;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {
    User findByUsername(String username);
    User findByMail(String mail);
    User findByUsernameOrMail(String username, String mail);
}
