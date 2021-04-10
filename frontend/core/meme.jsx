import * as UI from "@chakra-ui/react";
import * as Config from "./config";
import { ChatIcon } from "@chakra-ui/icons";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { timeSince } from "./utils";
import Link from "next/link";

export const Meme = (props) => {
    const {
        id,
        title,
        author,
        uploadDate,
        commentsAmount,
        votes,
        image,
    } = props;

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

                <UI.Button
                    type="submit"
                    variant="outline"
                    borderColor={Config.Text}
                    color={Config.Text}
                    width="35px"
                    height="35px"
                    _hover={{
                        color: Config.Accent,
                        borderColor: Config.Accent,
                    }}
                >
                    <UI.Icon as={AiOutlinePlus} fontSize="lg" />
                </UI.Button>

                <UI.Text
                    fontSize="lg"
                    fontWeight="bold"
                    paddingLeft="10px"
                    paddingRight="10px"
                >
                    {votes}
                </UI.Text>

                <UI.Button
                    type="submit"
                    variant="outline"
                    borderColor={Config.Text}
                    color={Config.Text}
                    width="35px"
                    height="35px"
                    _hover={{
                        color: Config.Accent,
                        borderColor: Config.Accent,
                    }}
                >
                    <UI.Icon as={AiOutlineMinus} fontSize="lg" />
                </UI.Button>
            </UI.HStack>
        </UI.VStack>
    );
};
