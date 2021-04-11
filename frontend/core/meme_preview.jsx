import * as UI from "@chakra-ui/react";
import * as Config from "./config";
import * as API from "./api";

import { VoteButton } from "./utils";
import { ChatIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import { timeSince } from "./utils";
import Link from "next/link";

export const Meme = (props) => {
    const { id, title, author, uploadDate, comments, votes, image } = props;

    const toast = UI.useToast();
    const [currentVotes, setCurrentVotes] = useState(votes);
    const [commentsAmount, setCommentsAmount] = useState(0);

    useEffect(() => {
        let amount = 0;
        comments.forEach((comment) => {
            amount += comment.replies.length + 1;
        });

        setCommentsAmount(amount);
    }, []);

    return (
        <UI.VStack
            backgroundColor={Config.BackgroundDarker}
            width="100%"
            borderRadius="15px"
            marginBottom="20px"
            paddingLeft="15px"
            paddingRight="15px"
            spacing={0}
        >
            <UI.HStack
                alignItems="center"
                width="100%"
                height="55px"
                spacing={0}
            >
                <UI.Heading size="lg" fontWeight="bold" paddingLeft="10px">
                    <Link href={"/meme?id=" + id}>{title}</Link>
                </UI.Heading>

                <UI.Spacer />

                <Link href={"/meme?id=" + id}>
                    <a>
                        <UI.HStack>
                            <ChatIcon fontSize="lg" fontWeight="bold" />
                            <UI.Text fontSize="lg" fontWeight="bold">
                                {commentsAmount}
                            </UI.Text>
                        </UI.HStack>
                    </a>
                </Link>
            </UI.HStack>

            <Link href={"/meme?id=" + id} marginTop="10px" paddingBottom="10px">
                <UI.Image
                    src={Config.restAddress + "/uploads/memes/" + image}
                    width="100%"
                    height="auto"
                    borderRadius="15px"
                    _hover={{ cursor: "pointer" }}
                />
            </Link>

            <UI.HStack
                width="100%"
                height="55px"
                alignItems="center"
                spacing={0}
            >
                <UI.Text
                    fontSize="2xl"
                    color={Config.Accent}
                    fontWeight="bold"
                    paddingRight="15px"
                >
                    <Link href={"/users/" + author}>{author}</Link>
                </UI.Text>

                <UI.Text fontSize="lg">
                    {timeSince(new Date(parseInt(uploadDate)))}
                </UI.Text>

                <UI.Spacer />

                <VoteButton
                    plus="true"
                    size="32px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, true, true, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />

                <UI.Text
                    fontSize="lg"
                    fontWeight="bold"
                    paddingLeft="10px"
                    paddingRight="10px"
                >
                    {currentVotes}
                </UI.Text>

                <VoteButton
                    plus="false"
                    size="32px"
                    onClick={async () => {
                        let newVotes = await API.vote(id, true, false, toast);
                        if (newVotes != undefined) {
                            setCurrentVotes(newVotes);
                        }
                    }}
                />
            </UI.HStack>
        </UI.VStack>
    );
};
