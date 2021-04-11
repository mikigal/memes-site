import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Meme } from "../core/meme_preview";
import { CommentsSection } from "../core/comments_section";
import { fetcher, ErrorAlert } from "../core/utils";

import useSWR from "swr";

export default function MemeView() {
    const router = useRouter();
    const memeId = router.query.id === undefined ? -1 : router.query.id;

    const { data, error } = useSWR(
        Config.restAddress + "/meme/" + memeId,
        fetcher
    );

    if (error) {
        return (
            <ErrorAlert
                title="Something went wrong!"
                description=" An error occurred while loading meme"
            />
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
                comments={data.comments}
                image={data.image}
            />

            <CommentsSection comments={data.comments} />
        </>
    );
}
