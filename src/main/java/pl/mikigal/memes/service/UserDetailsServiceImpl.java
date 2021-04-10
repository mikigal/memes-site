package pl.mikigal.memes.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.authorization.UserDetailsImpl;
import pl.mikigal.memes.data.user.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String loginData) throws UsernameNotFoundException {
        User user = this.userRepository.findByUsernameOrMail(loginData, loginData);
        if (user == null) {
            throw new UsernameNotFoundException(loginData);
        }

        return new UserDetailsImpl(user);
    }
}
