import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";
import * as API from "../utils/api";

import { LoginForm } from "./profile";
import { formatDate } from "../utils/utils";
import { BellIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";

export const Navbar = () => {
    const { user, loading } = API.useUser();
    const logo = UI.useBreakpointValue({
        base: "/logo-min.png",
        md: "/logo.png",
    });

    const navbarLogin = UI.useBreakpointValue({
        base: "block",
        md: "none",
    });

    if (loading) {
        return <UI.Text>Loading...</UI.Text>;
    }

    return (
        <UI.Flex
            width="100vw"
            height="55px"
            position="fixed"
            justifyContent="space-evenly"
            backgroundColor={Config.BackgroundDarker}
            zIndex="10"
        >
            <Link href="/">
                <a>
                    <UI.Image src={logo} />
                </a>
            </Link>

            <UI.HStack spacing="0">
                <NavbarEntry target="/" name="Home" />
                <NavbarSeparator />
                <NavbarEntry target="/newest" name="Newest" />
                <NavbarSeparator />
                <NavbarEntry target="/top" name="Top" />
                <UI.Text
                    fontWeight="light"
                    paddingLeft="15px"
                    paddingRight="5px"
                >
                    |
                </UI.Text>

                <UI.Popover closeOnBlur={true} closeOnEsc={true}>
                    {({ isOpen, onClose }) => (
                        <>
                            <UI.PopoverTrigger>
                                <UI.Button
                                    display={
                                        user === undefined ? "none" : "block"
                                    }
                                    background="transparent"
                                    width="1px"
                                    _hover={{ background: "transparent" }}
                                    _active={{ background: "transparent" }}
                                    _focus={{ background: "transparent" }}
                                    disabled={
                                        user === undefined ||
                                        user.notifications.length === 0
                                    }
                                >
                                    <UI.Box>
                                        <BellIcon
                                            fontSize={{
                                                base: "25px",
                                                lg: "30px",
                                            }}
                                        />

                                        <UI.Box
                                            display={
                                                user === undefined ||
                                                user.notifications.length === 0
                                                    ? "none"
                                                    : "block"
                                            }
                                            width={{ base: "8px", lg: "9px" }}
                                            height={{ base: "8px", lg: "9px" }}
                                            position="fixed"
                                            zIndex="11"
                                            marginTop={{
                                                base: "-21px",
                                                lg: "-26px",
                                            }}
                                            marginLeft={{
                                                base: "13px",
                                                lg: "17px",
                                            }}
                                            borderRadius="360"
                                            backgroundColor="red"
                                        ></UI.Box>
                                    </UI.Box>
                                </UI.Button>
                            </UI.PopoverTrigger>
                            <UI.PopoverContent
                                background={Config.BackgroundDarker}
                                border="none"
                                borderRadius="15px"
                                width="370px"
                                maxWidth="90vw"
                            >
                                <UI.PopoverArrow />
                                <UI.PopoverCloseButton
                                    fontSize="md"
                                    marginTop="4px"
                                    _hover={{ color: Config.Accent }}
                                    transition="color 0.15s ease"
                                />
                                <UI.PopoverHeader
                                    fontSize={{ base: "lg", lg: "xl" }}
                                >
                                    Notifications
                                </UI.PopoverHeader>
                                <UI.PopoverBody>
                                    <UI.VStack
                                        divider={
                                            <UI.StackDivider
                                                borderColor={Config.Text}
                                            />
                                        }
                                    >
                                        {user !== undefined &&
                                            user.notifications.map(
                                                (notification) => (
                                                    <Notification
                                                        key={notification.id}
                                                        id={notification.id}
                                                        memeId={
                                                            notification.memeId
                                                        }
                                                        memeImage={
                                                            notification.memeImage
                                                        }
                                                        date={notification.date}
                                                        pingedBy={
                                                            notification.pingedBy
                                                        }
                                                        closePopover={onClose}
                                                    />
                                                )
                                            )}
                                        <UI.Text
                                            _hover={{
                                                color: Config.Accent,
                                                cursor: "pointer",
                                            }}
                                            transition="color 0.15s ease"
                                            onClick={() => {
                                                API.sendAuthorizedRequest(
                                                    "/read_all_notifications",
                                                    "POST",
                                                    {}
                                                );

                                                mutate(
                                                    Config.restAddress + "/user"
                                                );
                                                onClose();
                                            }}
                                        >
                                            Mark all as read
                                        </UI.Text>
                                    </UI.VStack>
                                </UI.PopoverBody>
                            </UI.PopoverContent>
                        </>
                    )}
                </UI.Popover>

                <UI.Popover>
                    {({ isOpen, onClose }) => (
                        <>
                            <UI.PopoverTrigger>
                                <UI.Button
                                    display={
                                        user === undefined
                                            ? navbarLogin
                                            : "none"
                                    }
                                    background="transparent"
                                    width="1px"
                                    _hover={{ background: "transparent" }}
                                    _active={{ background: "transparent" }}
                                    _focus={{ background: "transparent" }}
                                >
                                    <UI.Icon
                                        as={AiOutlineUser}
                                        fontSize="2xl"
                                    />
                                </UI.Button>
                            </UI.PopoverTrigger>
                            <UI.PopoverContent
                                background={Config.BackgroundDarker}
                                border="none"
                                borderRadius="15px"
                                width="340px"
                                maxWidth="90vw"
                            >
                                <UI.PopoverArrow />
                                <UI.PopoverCloseButton
                                    fontSize="md"
                                    marginTop="4px"
                                    _hover={{ color: Config.Accent }}
                                    transition="color 0.15s ease"
                                />
                                <UI.PopoverHeader
                                    fontSize={{ base: "lg", lg: "xl" }}
                                >
                                    Login
                                </UI.PopoverHeader>
                                <UI.PopoverBody>
                                    <LoginForm
                                        popover={true}
                                        popoverClose={onClose}
                                    />
                                </UI.PopoverBody>
                            </UI.PopoverContent>
                        </>
                    )}
                </UI.Popover>
            </UI.HStack>
        </UI.Flex>
    );
};

const Notification = (props) => {
    const { id, memeId, memeImage, date, pingedBy, closePopover } = props;
    return (
        <Link href={"/meme/" + memeId}>
            <UI.HStack
                width="100%"
                _hover={{ color: Config.Accent, cursor: "pointer" }}
                transition="color 0.15s ease"
                onClick={() => {
                    API.sendAuthorizedRequest("/read_notification", "POST", {
                        id: id,
                    });

                    mutate(Config.restAddress + "/user");
                    closePopover();
                }}
            >
                <UI.Image
                    width="50px"
                    height="50px"
                    objectFit="cover"
                    objectPosition="100% 0"
                    borderRadius="5px"
                    src={
                        Config.restAddress +
                        "/uploads/memes/" +
                        memeImage +
                        ".png"
                    }
                />

                <UI.Box>
                    <UI.Text fontSize="sm">
                        {"You have been called by " + pingedBy}
                    </UI.Text>
                    <UI.Text fontSize="sm">
                        {formatDate(new Date(date), true)}
                    </UI.Text>
                </UI.Box>
            </UI.HStack>
        </Link>
    );
};

const NavbarEntry = (props) => {
    let router = useRouter();
    let { name, target } = props;

    return (
        <UI.Text
            fontSize={{ base: "lg", lg: "xl" }}
            transition="color 0.15s ease"
            color={router.asPath == target ? Config.Accent : Config.Text}
            _hover={{ color: Config.Accent }}
        >
            <Link href={target}>{name}</Link>
        </UI.Text>
    );
};

const NavbarSeparator = () => {
    return (
        <UI.Text fontWeight="light" paddingLeft="15px" paddingRight="15px">
            |
        </UI.Text>
    );
};
