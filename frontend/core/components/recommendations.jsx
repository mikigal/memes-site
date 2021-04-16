import * as UI from "@chakra-ui/react";

import * as Config from "../config";
import * as API from "../utils/api";
import { fetcher, ErrorAlert } from "../utils/utils";

import useSWR from "swr";
import Link from "next/link";

export const Recommendations = () => {
    const { data, error } = useSWR(
        Config.restAddress + "/recommendations",
        fetcher
    );

    if (!data) {
        return <UI.Text>Loading...</UI.Text>;
    }

    if (error) {
        return (
            <ErrorAlert
                title="Something went wrong!"
                description=" An error occurred while recommendations"
            />
        );
    }

    return (
        <UI.VStack
            width="340px"
            borderRadius="15px"
            background={Config.BackgroundDarker}
            padding="15px"
            justifyContent="center"
            spacing="0"
        >
            <UI.Text
                fontSize={{ base: "2xl", lg: "27px" }}
                fontWeight="bold"
                marginBottom="10px"
                marginTop="-8px"
            >
                Recommendations
            </UI.Text>

            <UI.VStack spacing="15px" width="100%">
                {data.map((meme) => (
                    <RecommendationsEntry
                        key={meme.id}
                        id={meme.id}
                        title={meme.title}
                        image={meme.image}
                    />
                ))}
            </UI.VStack>
        </UI.VStack>
    );
};

const RecommendationsEntry = (props) => {
    const { id, title, image } = props;
    return (
        <Link href={"/meme/" + id}>
            <UI.Flex
                width="100%"
                height="170px"
                borderRadius="15px"
                backgroundSize="cover"
                backgroundImage={
                    "url(" +
                    Config.restAddress +
                    "/uploads/memes/" +
                    image +
                    ".png)"
                }
                _hover={{ cursor: "pointer" }}
            >
                <UI.Center
                    alignSelf="flex-end"
                    width="100%"
                    height="40px"
                    borderBottomLeftRadius="15px"
                    borderBottomRightRadius="15px"
                    backgroundColor="#101114F0"
                >
                    <UI.Text fontSize={{ base: "md", lg: "xl" }}>
                        {title}
                    </UI.Text>
                </UI.Center>
            </UI.Flex>
        </Link>
    );
};
