package pl.mikigal.memes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.mikigal.memes.data.comment.Comment;
import pl.mikigal.memes.data.comment.CommentRepository;
import pl.mikigal.memes.data.dto.*;
import pl.mikigal.memes.data.meme.Meme;
import pl.mikigal.memes.data.meme.MemeRepository;
import pl.mikigal.memes.data.notification.Notification;
import pl.mikigal.memes.data.notification.NotificationRepository;
import pl.mikigal.memes.data.user.User;
import pl.mikigal.memes.data.user.UserRepository;
import pl.mikigal.memes.service.StorageService;
import pl.mikigal.memes.service.UploadType;

import javax.validation.Valid;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RestController
public class UserController {

	private final UserRepository userRepository;
	private final MemeRepository memeRepository;
	private final CommentRepository commentRepository;
	private final NotificationRepository notificationRepository;
	private final StorageService storageService;

	public UserController(MemeRepository memeRepository,
						  UserRepository userRepository,
						  CommentRepository commentRepository,
						  NotificationRepository notificationRepository,
						  StorageService storageService) {
		this.memeRepository = memeRepository;
		this.userRepository = userRepository;
		this.commentRepository = commentRepository;
		this.notificationRepository = notificationRepository;
		this.storageService = storageService;
	}

	@GetMapping("/user")
	public Object user(Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		return new UserDto(user);
	}

	@PostMapping("/vote")
	public Object voteMeme(@RequestBody VoteDto vote, Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		if (vote.isMeme()) {
			Optional<Meme> optional = this.memeRepository.findById(vote.getId());
			if (!optional.isPresent()) {
				return ResponseEntity.badRequest().body(new RestResponse(false, "invalid meme id"));
			}

			Meme meme = optional.get();
			int newState = user.vote(meme, vote.isPlus());
			meme = this.memeRepository.save(meme);

			return new VoteResponseDto(meme.getVotes(), newState);
		}

		Optional<Comment> optional = this.commentRepository.findById(vote.getId());
		if (!optional.isPresent()) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid comment id"));
		}

		Comment comment = optional.get();
		int newState = user.vote(comment, vote.isPlus());
		comment = commentRepository.save(comment);

		return new VoteResponseDto(comment.getVotes(), newState);
	}

	@PostMapping("/upload_meme")
	public Object upload(@RequestParam("file") MultipartFile file, @RequestParam("title") String title, Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		if (title.trim().length() < 3) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "Title is too short"));
		}

		if (title.length() > 32) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "Title is too long"));
		}

		try {
			UUID image = this.storageService.store(UploadType.MEME, file.getBytes());
			this.memeRepository.save(new Meme(user, title.trim(), image));
			return new RestResponse(true, "success");
		} catch (IOException | IllegalStateException e) {
			return ResponseEntity.status(500).body(new RestResponse(false, "An error occurred while processing image"));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new RestResponse(false, e.getMessage()));
		}
	}

	@PostMapping(value = "/comment")
	public ResponseEntity<?> comment(@Valid @RequestBody CommentFormDto commentForm, Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		Optional<Meme> memeOptional = this.memeRepository.findById(commentForm.getMemeId());
		if (!memeOptional.isPresent()) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid meme id"));
		}

		Meme meme = memeOptional.get();
		boolean isReply = commentForm.getReplyTo() != -1;

		for (String word : commentForm.getContent().split(" ")) {
			if (!word.startsWith("@")) {
				continue;
			}

			String username = word.replace("@", "");
			User target = this.userRepository.findByUsername(username);
			if (target == null) {
				continue;
			}

			this.notificationRepository.save(new Notification(target, meme, new Date(), user.getUsername()));
		}

		if (!isReply) {
			this.commentRepository.save(new Comment(user, meme, commentForm.getContent(), null));
			return ResponseEntity.ok().body(new RestResponse(true, "success"));
		}

		Optional<Comment> replyToOptional = this.commentRepository.findById(commentForm.getReplyTo());
		if (!replyToOptional.isPresent()) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid replyTo id"));
		}

		Comment replyTo = replyToOptional.get();
		if (replyTo.isReply()) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "cant reply to another reply"));
		}

		this.commentRepository.save(new Comment(user, meme, commentForm.getContent(), replyTo));
		return ResponseEntity.ok().body(new RestResponse(true, "success"));
	}

	@PostMapping("read_notification")
	public Object readNotification(@Valid @RequestBody ReadNotificationDto readNotificationDto, Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		Optional<Notification> notificationOptional = this.notificationRepository.findById(readNotificationDto.getId());
		if (!notificationOptional.isPresent()) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid notification id"));
		}

		Notification notification = notificationOptional.get();
		if (!notification.getUser().equals(user)) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "notification does not belong to you"));
		}

		this.notificationRepository.delete(notification);
		return ResponseEntity.ok().body(new RestResponse(true, "success"));
	}

	@PostMapping("read_all_notifications")
	public Object readAllNotifications(Authentication authentication) {
		User user = this.userRepository.findByUsernameOrMail(authentication.getName(), authentication.getName());
		if (user == null) {
			return ResponseEntity.badRequest().body(new RestResponse(false, "invalid user"));
		}

		this.notificationRepository.deleteAll(user.getNotifications());
		return ResponseEntity.ok().body(new RestResponse(true, "success"));
	}
}
