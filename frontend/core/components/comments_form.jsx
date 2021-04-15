import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";
import * as API from "../utils/api";
import * as Yup from "yup";

import { useState, useRef } from "react";
import { Formik, Form, useField } from "formik";
import { BiSend } from "react-icons/bi";
import autosize from "autosize";

export const CommentForm = (props) => {
    const toast = UI.useToast();
    const { memeId, replyTo, replyToAuthor } = props;

    const { user, loading } = API.useUser();

    if (loading) {
        return (
            <UI.Flex justifyContent="center">
                <UI.Text fontSize="20px">Loading memes...</UI.Text>
            </UI.Flex>
        );
    }
    if (user === undefined) {
        return <></>;
    }

    return (
        <UI.Box
            width="100%"
            borderRadius="15px"
            padding="15px"
            background={Config.BackgroundDarker}
        >
            <Formik
                initialValues={{ content: "" }}
                validationSchema={Yup.object().shape({
                    content: Yup.string()
                        .required("This field is required")
                        .min(6, "Comment is too short")
                        .max(511, "Comment is too long"),
                })}
                onSubmit={async (values, actions) => {
                    const { error } = API.sendAuthorizedRequest(
                        "/comment",
                        "POST",
                        {
                            memeId: memeId,
                            replyTo: replyTo,
                            content: values.content,
                        }
                    );

                    if (error != null) {
                        toast({
                            title: "Login required",
                            description: "You must be logged in to do that",
                            status: "error",
                            duration: 6000,
                            isClosable: true,
                            position: "bottom-right",
                        });
                        return;
                    }

                    location.reload();
                }}
            >
                {(props) => (
                    <Form>
                        <UI.HStack
                            width="100%"
                            spacing="10px"
                            alignItems="start"
                        >
                            <CommmentInput
                                id="content"
                                type="text"
                                placeholder="Content"
                                replyToAuthor={replyToAuthor}
                            />

                            <UI.Spacer />

                            <UI.Button
                                isLoading={props.isSubmitting}
                                isDisabled={!props.isValid}
                                loadingText="Logging in"
                                type="submit"
                                variant="outline"
                                width="13%"
                                height="50px"
                                borderColor={Config.Text}
                                color={Config.Text}
                                _hover={{
                                    color: Config.Accent,
                                    borderColor: Config.Accent,
                                }}
                            >
                                <UI.Icon as={BiSend} fontSize="2xl" />
                            </UI.Button>
                        </UI.HStack>
                    </Form>
                )}
            </Formik>
        </UI.Box>
    );
};

const CommmentInput = (props) => {
    const { id, type, placeholder, replyToAuthor } = props;
    const [field, meta] = useField(id);

    const [content, setContent] = useState(
        replyToAuthor === undefined ? "" : "@" + replyToAuthor + " "
    );

    const textarea = useRef(null);
    autosize(textarea.current);

    return (
        <UI.Box width="83%">
            <UI.FormControl id={id} isInvalid={meta.error && meta.touched}>
                <UI.Textarea
                    {...field}
                    ref={textarea}
                    id={id}
                    type={type}
                    width="100%"
                    height="auto"
                    placeholder={placeholder}
                    borderColor={Config.Text}
                    _hover={{ borderColor: Config.Accent }}
                    _focus={{ borderColor: Config.Accent }}
                    onInput={(event) => {
                        setContent(event.target.value);
                    }}
                    value={content}
                />
                <UI.FormErrorMessage>{meta.error}</UI.FormErrorMessage>
            </UI.FormControl>
        </UI.Box>
    );
};
