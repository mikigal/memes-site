import * as UI from "@chakra-ui/react";
import * as Yup from "yup";

import * as Config from "../config.json";
import * as API from "../utils/api";
import { formatDate } from "../utils/utils";

import { Formik, Form, useField } from "formik";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

import { BiLogOut } from "react-icons/bi";
import { BsCardImage } from "react-icons/bs";
import { ChatIcon, CalendarIcon } from "@chakra-ui/icons";

export const Profile = () => {
    const toast = UI.useToast();
    const router = useRouter();
    const { loading, user } = API.useUser();

    const navbarLogin = UI.useBreakpointValue({
        base: "block",
        md: "none",
    });

    if (loading) {
        return (
            <UI.Flex justifyContent="center">
                <UI.Text fontSize="20px">Loading...</UI.Text>
            </UI.Flex>
        );
    }

    if (user === undefined) {
        return <>{navbarLogin === "none" && <LoginForm popover={false} />}</>;
    }

    return <ProfilePreview user={user} otherUser={false} />;
};

export const ProfilePreview = (props) => {
    const { user, otherUser } = props;
    const [parsedDate, setParsedDate] = useState();
    useEffect(() => {
        let registerDate = new Date(user.registerDate);
        setParsedDate(formatDate(registerDate, false));
    }, [user]);

    return (
        <UI.HStack
            alignItems="center"
            backgroundColor={Config.BackgroundDarker}
            width={otherUser ? "360px" : "340px"}
            borderRadius="15px"
            spacing="0"
            padding="15px"
            marginBottom={otherUser ? "10px" : "20px"}
        >
            <UI.Image
                width={otherUser ? "120px" : "100px"}
                height={otherUser ? "120px" : "100px"}
                borderRadius="15px"
                marginRight="15px"
                src={
                    user.avatar === null
                        ? "/unknown.png"
                        : Config.restAddress +
                          "/uploads/users/" +
                          user.avatar +
                          ".png"
                }
            />

            <UI.VStack
                justifyContent="start"
                alignItems="start"
                spacing="3px"
                width={otherUser ? "auto" : "100%"}
            >
                <UI.HStack
                    width="100%"
                    height="20px"
                    spacing="0"
                    paddingRight="10px"
                    paddingBottom="10px"
                >
                    <UI.Text
                        fontSize={{ base: "xl", lg: "2xl" }}
                        fontWeight="bold"
                    >
                        {user.username}
                    </UI.Text>

                    <UI.Spacer />

                    <UI.Icon
                        display={otherUser ? "none" : "block"}
                        fontSize="2xl"
                        as={BiLogOut}
                        transition="color 0.15s ease"
                        _hover={{ color: Config.Accent }}
                        onClick={async () => {
                            await API.logout();
                            API.refreshSessionState();
                            location.reload(false);
                        }}
                    />
                </UI.HStack>

                <UI.HStack>
                    <UI.Icon as={BsCardImage} />
                    <UI.Text
                        fontSize={{ base: "sm", lg: "md" }}
                        paddingLeft="3px"
                    >
                        {user.memesAmount +
                            " meme" +
                            (user.memesAmount === 1 ? "" : "s")}
                    </UI.Text>
                </UI.HStack>

                <UI.HStack>
                    <ChatIcon />
                    <UI.Text
                        fontSize={{ base: "sm", lg: "md" }}
                        paddingLeft="3px"
                    >
                        {user.commentsAmount +
                            " comment" +
                            (user.commentsAmount === 1 ? "" : "s")}
                    </UI.Text>
                </UI.HStack>

                <UI.HStack>
                    <CalendarIcon />
                    <UI.Text
                        fontSize={{ base: "sm", lg: "md" }}
                        paddingLeft="3px"
                    >
                        {parsedDate}
                    </UI.Text>
                </UI.HStack>
            </UI.VStack>
        </UI.HStack>
    );
};

export const LoginForm = (props) => {
    const toast = UI.useToast();
    const { popover, popoverClose } = props;

    return (
        <UI.Box
            width={popover ? "320px" : "340px"}
            borderRadius="15px"
            padding={popover ? "0px" : "15px"}
            background={Config.BackgroundDarker}
            marginBottom={popover ? "0px" : "20px"}
        >
            <Formik
                initialValues={{ usernameLogin: "", passwordLogin: "" }}
                validationSchema={Yup.object().shape({
                    usernameLogin: Yup.string().required(
                        "This field is required"
                    ),
                    passwordLogin: Yup.string().required(
                        "This field is required"
                    ),
                })}
                onSubmit={async (values, actions) => {
                    const response = await fetch(
                        Config.restAddress + "/login",
                        {
                            method: "POST",
                            mode: "cors",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: values.usernameLogin,
                                password: values.passwordLogin,
                            }),
                        }
                    );

                    API.refreshSessionState();

                    if (response.status !== 200) {
                        toast({
                            title: "Login error",
                            description: "Invalid username or password",
                            status: "error",
                            duration: 6000,
                            isClosable: true,
                            position: "bottom-right",
                        });
                        return;
                    }

                    if (popover) {
                        popoverClose();
                    }
                    toast.closeAll();
                    toast({
                        title: "Login success",
                        description: "You have been logged in successfuly",
                        status: "success",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                }}
            >
                {(props) => (
                    <Form>
                        <UI.VStack align="center" spacing="10px">
                            <TextInput
                                id="usernameLogin"
                                type="text"
                                placeholder="Username"
                                label="Username"
                            />
                            <TextInput
                                id="passwordLogin"
                                type="password"
                                placeholder="Password"
                                label="Password"
                            />

                            <UI.Button
                                isLoading={props.isSubmitting}
                                isDisabled={!props.isValid}
                                loadingText="Logging in"
                                type="submit"
                                variant="outline"
                                width="150px"
                                borderColor={Config.Text}
                                color={Config.Text}
                                _hover={{
                                    color: Config.Accent,
                                    borderColor: Config.Accent,
                                }}
                            >
                                Log in
                            </UI.Button>
                        </UI.VStack>
                    </Form>
                )}
            </Formik>

            <Link href="/register">
                <UI.Text
                    textAlign="center"
                    marginTop="7px"
                    fontSize="lg"
                    _hover={{ color: Config.Accent, cursor: "pointer" }}
                    transition="color 0.15s ease"
                >
                    New user? Register here
                </UI.Text>
            </Link>
        </UI.Box>
    );
};

const TextInput = (props) => {
    const { id, type, placeholder, label } = props;
    const [field, meta] = useField(id);

    return (
        <UI.Box width="95%">
            <UI.FormControl id={id} isInvalid={meta.error && meta.touched}>
                <UI.FormLabel htmlFor={id}>{label}</UI.FormLabel>
                <UI.Input
                    {...field}
                    id={id}
                    type={type}
                    width="100%"
                    placeholder={placeholder}
                    borderColor={Config.Text}
                    _hover={{ borderColor: Config.Accent }}
                    _focus={{ borderColor: Config.Accent }}
                />
                <UI.FormErrorMessage>{meta.error}</UI.FormErrorMessage>
            </UI.FormControl>
        </UI.Box>
    );
};
