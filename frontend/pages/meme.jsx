import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Meme } from "../core/meme";
import { CommentsSection } from "../core/comments_section";

import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function MemeView() {
    const router = useRouter();
    const memeId = router.query.id === undefined ? -1 : router.query.id;

    const { data, error } = useSWR(
        Config.restAddress + "/meme/" + memeId,
        fetcher
    );

    if (error || (data && data.error)) {
        return (
            <UI.Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
                color={Config.BackgroundDarker}
            >
                <UI.AlertIcon boxSize="40px" mr={0} />
                <UI.AlertTitle mt={4} mb={1} fontSize="lg">
                    Something went wrong!
                </UI.AlertTitle>
                <UI.AlertDescription maxWidth="sm">
                    An error occurred while loading meme
                </UI.AlertDescription>
            </UI.Alert>
        );
    }

    if (!data) {
        return (
            <UI.Flex justifyContent="center">
                <UI.Text fontSize="20px">Loading memes...</UI.Text>
            </UI.Flex>
        );
    }

    return (
        <>
            <Meme
                id={data.id}
                title={data.title}
                author={data.author}
                uploadDate={data.uploadDate}
                votes={data.votes}
                commentsAmount={data.comments.length}
                image={data.image}
            />

            <CommentsSection comments={data.comments} />
        </>
    );
}
