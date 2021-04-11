import * as UI from "@chakra-ui/react";
import * as Yup from "yup";

import * as Config from "../config.json";
import * as API from "../utils/api";

import { Formik, Form, useField } from "formik";
import { BiLogOut } from "react-icons/bi";
import { useRouter } from "next/router";

export const Profile = () => {
    const toast = UI.useToast();
    const router = useRouter();
    const { loading, user } = API.useUser();

    if (loading) {
        <UI.Flex justifyContent="center">
            <UI.Text fontSize="20px">Loading...</UI.Text>
        </UI.Flex>;
    }

    if (user === undefined) {
        return <LoginForm />;
    }

    return (
        <UI.HStack
            alignItems="start"
            backgroundColor={Config.BackgroundDarker}
            width="320px"
            borderRadius="15px"
            spacing="0"
            paddingTop="15px"
            paddingBottom="15px"
        >
            <UI.Image
                width="100px"
                height="100px"
                borderRadius="15px"
                src={Config.restAddress + "/uploads/users/" + user.avatar}
            />

            <UI.HStack
                paddingTop="25px"
                height="20px"
                alignItems="center"
                width="100%"
                spacing="0"
                paddingRight="20px"
            >
                <UI.Text fontSize="2xl" fontWeight="bold">
                    {user.username}
                </UI.Text>

                <UI.Spacer />

                <UI.Icon
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
        </UI.HStack>
    );
};

const LoginForm = () => {
    const toast = UI.useToast();

    return (
        <UI.Box width="320px" marginLeft="20px">
            <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required("This field is required"),
                    password: Yup.string().required("This field is required"),
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
                                username: values.username,
                                password: values.password,
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
                        <UI.VStack align="center">
                            <TextInput
                                id="username"
                                type="text"
                                placeholder="Username"
                                label="Username"
                            />
                            <TextInput
                                id="password"
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
                                marginTop="5px"
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
        </UI.Box>
    );
};

const TextInput = (props) => {
    const { id, type, placeholder, label } = props;
    const [field, meta] = useField(id);

    return (
        <UI.Box>
            <UI.FormControl id={id} isInvalid={meta.error && meta.touched}>
                <UI.FormLabel htmlFor={id}>{label}</UI.FormLabel>
                <UI.Input
                    {...field}
                    id={id}
                    type={type}
                    width="320px"
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
