import * as UI from "@chakra-ui/react";
import * as Config from "./config";
import { ChatIcon } from "@chakra-ui/icons";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { timeSince } from "./utils";
import Link from "next/link";

export const Meme = (props) => {
    //TODO: Change logo-min.png to author's avatar
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
            padding="15px"
            marginBottom="25px"
            borderRadius="15px"
        >
            <UI.Box width="100%">
                <UI.HStack
                    alignItems="center"
                    justifyContent="space-between"
                    height="40px"
                    marginBottom="5px"
                >
                    <UI.HStack>
                        <Link href={"/user/" + author}>
                            <a>
                                <UI.Image
                                    src="/logo-min.png"
                                    maxHeight="40px"
                                    maxWidth="40px"
                                />
                            </a>
                        </Link>
                        <UI.Text fontSize="30px" fontWeight="bold">
                            <Link href={"/meme?id=" + id}>{title}</Link>
                        </UI.Text>
                    </UI.HStack>

                    <Link href={"/meme?id=" + id}>
                        <a>
                            <UI.HStack>
                                <ChatIcon fontSize="19px" fontWeight="bold" />
                                <UI.Text fontSize="18px" fontWeight="bold">
                                    {commentsAmount}
                                </UI.Text>
                            </UI.HStack>
                        </a>
                    </Link>
                </UI.HStack>
            </UI.Box>

            <Link href={"/meme?id=" + id}>
                <UI.Image
                    src={Config.restAddress + "/uploads/memes/" + image}
                    width="100%"
                    height="auto"
                    _hover={{ cursor: "pointer" }}
                />
            </Link>

            <UI.HStack
                width="100%"
                height="40px"
                justifyContent="space-between"
                alignItems="center"
            >
                <UI.HStack alignItems="center">
                    <UI.Text
                        fontSize="25px"
                        color={Config.Accent}
                        fontWeight="bold"
                        marginRight="5px"
                    >
                        <Link href={"/users/" + author}>{author}</Link>
                    </UI.Text>

                    <UI.Text fontSize="17px" paddingTop="5px">
                        {timeSince(new Date(parseInt(uploadDate)))}
                    </UI.Text>
                </UI.HStack>

                <UI.HStack alignItems="center" paddingTop="5px">
                    <UI.Text fontSize="25px" fontWeight="bold">
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
                        <UI.Icon as={AiOutlinePlus} fontSize="25px" />
                    </UI.Button>

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
                        <UI.Icon as={AiOutlineMinus} fontSize="25px" />
                    </UI.Button>
                </UI.HStack>
            </UI.HStack>
        </UI.VStack>
    );
};

/**<UI.HStack marginBottom="15px">
                    <UI.Text fontSize="15px" color={Config.Accent}>
                        <Link href={"/users/" + author}>{author}</Link>
                    </UI.Text>
                    <UI.Text fontSize="15px" marginLeft="10px">
                        {timeSince(new Date(parseInt(uploadDate)))}
                    </UI.Text>
                </UI.HStack> */
