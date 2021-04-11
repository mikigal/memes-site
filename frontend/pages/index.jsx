import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { Meme } from "../core/meme_preview";
import { useRouter } from "next/router";
import { fetcher, ErrorAlert } from "../core/utils";
import useSWR from "swr";

export default function Index() {
    const router = useRouter();
    const page = router.query.page == undefined ? 0 : router.query.page;

    const { data, error } = useSWR(
        Config.restAddress + "/memes?page=" + page,
        fetcher
    );

    if (error || (data && data.error)) {
        return (
            <ErrorAlert
                title="Something went wrong!"
                description="An error occurred while loading memes"
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
            {data.map((meme) => (
                <Meme
                    key={meme.id}
                    id={meme.id}
                    title={meme.title}
                    author={meme.author}
                    uploadDate={meme.uploadDate}
                    votes={meme.votes}
                    commentsAmount={meme.comments.length}
                    image={meme.image}
                />
            ))}
        </>
    );
}
