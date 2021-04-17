package pl.mikigal.memes.data;

import pl.mikigal.memes.data.user.User;

import java.util.Set;

public interface Votable {
	Set<User> getVotedMinusUsers();
	Set<User> getVotedPlusUsers();
	int getVotes();
	void setVotes(int votes);
}
