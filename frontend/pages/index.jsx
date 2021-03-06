import * as UI from "@chakra-ui/react";
import * as API from "../core/utils/api";
import * as Config from "../core/config.json";

import { fetcher, ErrorAlert } from "../core/utils/utils";
import { PageButtons } from "../core/components/page_buttons";
import { MemeUploader } from "../core/components/meme_uploader";
import { Meme } from "../core/components/meme_preview";

import { useRouter } from "next/router";
import useSWR from "swr";

export default function Index() {
    const router = useRouter();
    const page = parseInt(
        router.query.page == undefined ? 0 : router.query.page
    );

    const { data, error } = useSWR(
        Config.restAddress + "/memes?page=" + page,
        fetcher
    );

    if (error) {
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
            <MemeUploader currentPage={page} />
            {data.memes.map((meme) => (
                <Meme
                    key={meme.id}
                    id={meme.id}
                    title={meme.title}
                    author={meme.author}
                    uploadDate={meme.uploadDate}
                    votes={meme.votes}
                    commentsAmount={meme.commentsAmount}
                    image={meme.image}
                />
            ))}

            <PageButtons
                page={page}
                pages={data.pages}
                switchTo="/?page={page}"
            />
        </>
    );
}
