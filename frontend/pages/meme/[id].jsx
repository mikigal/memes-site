import * as UI from "@chakra-ui/react";

import * as Config from "../../core/config.json";
import { fetcher, ErrorAlert } from "../../core/utils/utils";
import { Meme } from "../../core/components/meme_preview";
import { CommentsSection } from "../../core/components/comments_section";

import { useRouter } from "next/router";
import useSWR from "swr";

export default function MemeView() {
    const router = useRouter();
    const { id } = router.query;

    const { data, error } = useSWR(Config.restAddress + "/meme/" + id, fetcher);

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
