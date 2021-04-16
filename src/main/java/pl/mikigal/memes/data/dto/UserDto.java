package pl.mikigal.memes.data.dto;

import lombok.Getter;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.notification.Notification;
import pl.mikigal.memes.data.user.User;

import java.util.*;
import java.util.stream.Collectors;

@Getter
public class UserDto {
    private final int id;
    private final String username;
    private final Date registerDate;
    private final UUID avatar;
    private final int memesAmount;
    private final int commentsAmount;
    private final List<NotificationDto> notifications;

    private final Map<Integer, Boolean> votedMemes;
    private final Map<Integer, Boolean> votedComments;

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.registerDate = user.getRegisterDate();
        this.avatar = user.getAvatar();
        this.memesAmount = user.getMemes().size();
        this.commentsAmount = user.getComments().size();
        this.notifications = user.getNotifications()
                .stream()
                .sorted(Comparator.comparing(Notification::getDate)) // Reverse?
                .map(NotificationDto::new)
                .collect(Collectors.toList());

        this.votedMemes = new HashMap<>();
        this.votedComments = new HashMap<>();

        for (Meme meme : user.getVotedPlusMemes()) {
            this.votedMemes.put(meme.getId(), true);
        }

        for (Meme meme : user.getVotedMinusMemes()) {
            this.votedMemes.put(meme.getId(), false);
        }

        for (Comment comment : user.getVotedPlusComments()) {
            this.votedComments.put(comment.getId(), true);
        }

        for (Comment comment : user.getVotedMinusComments()) {
            this.votedComments.put(comment.getId(), false);
        }
    }
}
