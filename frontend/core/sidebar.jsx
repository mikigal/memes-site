import * as UI from "@chakra-ui/react";
import * as Config from "./config.json";
import { Formik, Form, useField } from "formik";

export const Profile = () => {
    let loggedIn = false;
    if (!loggedIn) {
        return (
            <UI.Box width="320px" marginLeft="20px">
                <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={onSubmit}
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
    }

    return (
        <UI.Box width="300px" background="blue">
            profile
        </UI.Box>
    );
};

const onSubmit = (values, actions) => {
    console.log(values);
    console.log(actions);
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
                    marginBottom="15px"
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
