import * as UI from "@chakra-ui/react";
import * as Yup from "yup";

import * as Config from "../core/config.json";
import * as API from "../core/utils/api";

import { Formik, Form, useField } from "formik";
import { useRouter } from "next/router";
import Link from "next/link";

export default function register() {
    const { user, loading } = API.useUser();
    const router = useRouter();
    const toast = UI.useToast();

    if (loading) {
        return <UI.Text>Loading...</UI.Text>;
    }

    if (user !== undefined) {
        router.push("/");
        return <UI.Text>You are already logged in</UI.Text>;
    }

    return (
        <UI.Box
            width="100%"
            borderRadius="15px"
            padding="15px"
            background={Config.BackgroundDarker}
        >
            <UI.Heading size="lg" textAlign="center">
                Register
            </UI.Heading>

            <Formik
                initialValues={{
                    username: "",
                    mail: "",
                    password: "",
                    repeatPassword: "",
                    termsOfService: "",
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string()
                        .required("This field is required")
                        .min(6, "Username must be between 6 and 16 characters")
                        .max(
                            16,
                            "Username must be between 6 and 16 characters"
                        ),
                    mail: Yup.string()
                        .required("This field is required")
                        .min(6, "Mail must be between 6 and 32 characters")
                        .max(32, "Mail must be between 6 and 32 characters")
                        .email("Invalid mail address"),
                    password: Yup.string()
                        .required("This field is required")
                        .min(6, "Password must be between 6 and 32 characters")
                        .max(
                            32,
                            "Password must be between 6 and 32 characters"
                        ),
                    repeatPassword: Yup.string()
                        .required("This field is required")
                        .oneOf(
                            [Yup.ref("password"), null],
                            "Passwords are not the same"
                        )
                        .min(6, "Password must be between 6 and 32 characters")
                        .max(
                            32,
                            "Password must be between 6 and 32 characters"
                        ),
                    termsOfService: Yup.boolean().oneOf(
                        [true],
                        "You must accept Terms of Service"
                    ),
                })}
                onSubmit={async (values, actions) => {
                    if (user !== undefined) {
                        return;
                    }

                    const response = await fetch(
                        Config.restAddress + "/register",
                        {
                            method: "POST",
                            mode: "cors",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                username: values.username,
                                mail: values.mail,
                                password: values.password,
                                repeatPassword: values.repeatPassword,
                                termsOfService: values.termsOfService,
                            }),
                        }
                    );

                    API.refreshSessionState();

                    if (response.status !== 200) {
                        const errorJson = await response.json();
                        toast({
                            title: "Register error",
                            description: errorJson.message,
                            status: "error",
                            duration: 6000,
                            isClosable: true,
                            position: "bottom-right",
                        });
                        return;
                    }

                    toast.closeAll();
                    toast({
                        title: "Register success",
                        description: "You have been registered successfuly",
                        status: "success",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });

                    router.push("/");
                }}
            >
                {(props) => (
                    <Form>
                        <UI.VStack align="center" spacing="15px">
                            <TextInput
                                id="username"
                                type="text"
                                placeholder="Username"
                                label="Username"
                            />
                            <TextInput
                                id="mail"
                                type="text"
                                placeholder="Mail"
                                label="Mail"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="Password"
                                label="Password"
                            />
                            <TextInput
                                id="repeatPassword"
                                type="password"
                                placeholder="Repeat password"
                                label="Repeat password"
                            />
                            <TermsOfServiceInput />
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
                                Register
                            </UI.Button>
                        </UI.VStack>
                    </Form>
                )}
            </Formik>
        </UI.Box>
    );
}

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

const TermsOfServiceInput = (props) => {
    const [field, meta] = useField("termsOfService");

    return (
        <UI.Box width="95%" textAlign="center">
            <UI.FormControl
                id="termsOfService"
                isInvalid={meta.error && meta.touched}
            >
                <UI.Checkbox {...field} id="termsOfService">
                    Accept{" "}
                    <Link href="/tos">
                        <UI.Text
                            _hover={{ color: Config.Accent }}
                            display="inline-block"
                            transition="color 0.15s ease"
                        >
                            Terms of Service
                        </UI.Text>
                    </Link>
                </UI.Checkbox>
                <UI.FormErrorMessage>{meta.error}</UI.FormErrorMessage>
            </UI.FormControl>
        </UI.Box>
    );
};
