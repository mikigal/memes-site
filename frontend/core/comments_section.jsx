import * as UI from "@chakra-ui/react";
import * as Config from "./config.json";
import * as API from "./api";

import { VoteButton, sendAuthorizedRequest } from "./utils";

import { timeSince } from "../core/utils";
import { useState } from "react";

export const CommentsSection = (props) => {
    const { comments } = props;

    const [sortedComments, setSortedComments] = useState(
        comments.sort(compareByTime).slice()
    );
    const [sortMode, setSortMode] = useState(0);

    return (
        <UI.VStack
            backgroundColor={Config.BackgroundDarker}
            width="100%"
            spacing="0"
            paddingLeft="15px"
            paddingRight="15px"
            borderRadius="15px"
        >
            <UI.HStack
                width="100%"
                height="55px"
                alignItems="center"
                spacing="0"
            >
                <UI.Text fontSize="2xl" fontWeight="bold">
                    Comments
                </UI.Text>

                <UI.Spacer />

                <UI.Text
                    fontSize="lg"
                    paddingRight="15px"
                    _hover={{ color: Config.Accent }}
                    transition="color 0.15s ease"
                    color={sortMode === 0 ? Config.Accent : Config.Text}
                    onClick={() => {
                        setSortMode(0);
                        setSortedComments(comments.sort(compareByTime).slice());
                    }}
                >
                    Newest
                </UI.Text>

                <UI.Text
                    fontSize="lg"
                    _hover={{ color: Config.Accent }}
                    transition="color 0.15s ease"
                    color={sortMode === 1 ? Config.Accent : Config.Text}
                    onClick={() => {
                        setSortMode(1);
                        setSortedComments(
                            comments.sort(compareByVotes).slice()
                        );
                    }}
                >
                    Most popular
                </UI.Text>
            </UI.HStack>

            {sortedComments.map((comment) => (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    content={comment.content}
                    author={comment.author}
                    votes={comment.votes}
                    uploadDate={comment.uploadDate}
                    replies={comment.replies}
                />
            ))}
        </UI.VStack>
    );
};

const Comment = (props) => {
    const { id, author, votes, content, uploadDate, replies } = props;
    const toast = UI.useToast();
    const [currentVotes, setCurrentVotes] = useState(votes);

    return (
        <UI.Box width="100%" paddingBottom="15px">
            <UI.HStack>
                <UI.Image
                    src={
                        Config.restAddress + "/uploads/users/" + author + ".png"
                    }
                    width="45px"
                    height="45px"
                    borderRadius="5px"
                />
                <UI.Text color={Config.Accent} fontSize="xl" fontWeight="bold">
                    {author}
                </UI.Text>

                <UI.Text>{timeSince(new Date(parseInt(uploadDate)))}</UI.Text>

                <UI.Spacer />
                <VoteButton
                    plus="true"
                    size="27px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, false, true, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />

                <UI.Text fontSize="xl" fontWeight="bold">
                    {currentVotes}
                </UI.Text>

                <VoteButton
                    plus="false"
                    size="27px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, false, false, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />
            </UI.HStack>

            <UI.Text fontSize="md" paddingTop="7px">
                {content}
            </UI.Text>

            {replies.map((reply) => (
                <Reply
                    key={reply.id}
                    id={reply.id}
                    content={reply.content}
                    author={reply.author}
                    votes={reply.votes}
                    uploadDate={reply.uploadDate}
                />
            ))}
        </UI.Box>
    );
};

const Reply = (props) => {
    const { id, author, votes, content, uploadDate } = props;
    const toast = UI.useToast();
    const [currentVotes, setCurrentVotes] = useState(votes);

    return (
        <UI.Box marginLeft="7%" width="93%" paddingTop="15px">
            <UI.HStack>
                <UI.Image
                    src={
                        Config.restAddress + "/uploads/users/" + author + ".png"
                    }
                    width="45px"
                    height="45px"
                    borderRadius="5px"
                />
                <UI.Text color={Config.Accent} fontSize="xl" fontWeight="bold">
                    {author}
                </UI.Text>

                <UI.Text>{timeSince(new Date(parseInt(uploadDate)))}</UI.Text>

                <UI.Spacer />

                <VoteButton
                    plus="true"
                    size="27px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, false, true, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />
                <UI.Text
                    fontSize="xl"
                    fontWeight="bold"
                    paddingLeft="6px"
                    paddingRight="5px"
                >
                    {currentVotes}
                </UI.Text>

                <VoteButton
                    plus="false"
                    size="27px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, false, false, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />
            </UI.HStack>

            <UI.Text fontSize="md" paddingTop="7px">
                {content}
            </UI.Text>
        </UI.Box>
    );
};

const compareByTime = (meme1, meme2) => {
    if (meme1.uploadDate < meme2.uploadDate) {
        return 1;
    }

    if (meme1.uploadDate > meme2.uploadDate) {
        return -1;
    }

    return 0;
};

const compareByVotes = (meme1, meme2) => {
    if (meme1.votes < meme2.votes) {
        return 1;
    }

    if (meme1.votes > meme2.votes) {
        return -1;
    }

    return 0;
};
