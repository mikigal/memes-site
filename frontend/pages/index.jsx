import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { Meme } from "../core/meme";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Index() {
    const router = useRouter();
    const page = router.query.page == undefined ? 0 : router.query.page;

    const { data, error } = useSWR(
        Config.restAddress + "/memes?page=" + page,
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
                    An error occurred while loading memes
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
