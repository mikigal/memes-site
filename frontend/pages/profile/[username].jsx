import * as UI from "@chakra-ui/react";
import * as Config from "../../core/config.json";
import { ErrorAlert, formatDate } from "../../core/utils/utils";
import { PageButtons } from "../../core/components/page_buttons";
import { ProfilePreview } from "../../core/components/profile";
import { Meme } from "../../core/components/meme_preview";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function profile() {
    const router = useRouter();
    const username = router.query.username;
    const page = parseInt(
        router.query.page == undefined ? 0 : router.query.page
    );

    const { data, error } = useSWR(
        Config.restAddress + "/profile?username=" + username + "&page=" + page
    );

    if (error) {
        return (
            <ErrorAlert
                title="Something went wrong!"
                description="An error occurred while loading profile"
            />
        );
    }

    if (!data) {
        return (
            <UI.Flex justifyContent="center">
                <UI.Text fontSize="20px">Loading profile...</UI.Text>
            </UI.Flex>
        );
    }

    if (data.success === false) {
        return (
            <ErrorAlert
                title="Something went wrong!"
                description="User does not exists"
            />
        );
    }

    return (
        <>
            <UI.VStack width="100%" marginBottom="10px">
                <ProfilePreview user={data} otherUser={true} />
            </UI.VStack>
            {data.memesList.memes.map((meme) => (
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
                pages={data.memesList.pages}
                switchTo={"/profile/" + username + "?page={page}"}
            />
        </>
    );
}
