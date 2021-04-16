import * as UI from "@chakra-ui/react";
import * as API from "../core/utils/api";
import * as Config from "../core/config.json";

import { fetcher, ErrorAlert } from "../core/utils/utils";
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

    const previousPageText = UI.useBreakpointValue({
        base: "Previous",
        md: "Previous page",
    });

    const nextPageText = UI.useBreakpointValue({
        base: "Next",
        md: "Next page",
    });

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

            <UI.HStack paddingLeft="7%" paddingRight="7%" marginBottom="10px">
                <PageButton
                    redirectTo={page - 1}
                    lastPage={data.pages}
                    text={previousPageText}
                />
                <UI.Spacer />
                <UI.Text
                    fontSize={{ base: "2xl", md: "30px" }}
                    fontWeight="bold"
                >
                    {page + 1}
                </UI.Text>
                <UI.Spacer />
                <PageButton
                    redirectTo={page + 1}
                    maxPages={data.pages}
                    text={nextPageText}
                />
            </UI.HStack>
        </>
    );
}

const PageButton = (props) => {
    const { redirectTo, maxPages, text } = props;
    const router = useRouter();

    return (
        <UI.Button
            variant="outline"
            width="40%"
            height="45px"
            borderColor={Config.Text}
            color={Config.Text}
            disabled={redirectTo === -1 || redirectTo === maxPages}
            _hover={{
                color: Config.Accent,
                borderColor: Config.Accent,
            }}
            onClick={() => {
                router.push("/?page=" + redirectTo);
            }}
        >
            {text}
        </UI.Button>
    );
};
