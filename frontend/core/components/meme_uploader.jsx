import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";
import * as API from "../utils/api";

import { FaFileUpload } from "react-icons/fa";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { mutate } from "swr";

export const MemeUploader = (props) => {
    const { currentPage } = props;
    const toast = UI.useToast();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(undefined);
    const [title, setTitle] = useState("");
    const [dropMessage, setDropMessage] = useState("");
    const { isOpen, onToggle } = UI.useDisclosure();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/jpeg, image/png",
        maxSize: 5242880, // 5MB
        maxFiles: 1,
        onDropAccepted: (files) => {
            setFile(files[0]);
            setDropMessage("Selected file: " + files[0].name);
        },
        onDropRejected: () => setDropMessage("Allowed image types: JPEG, PNG"),
    });

    const upload = async () => {
        if (uploading) {
            return;
        }

        if (title.trim().length < 3) {
            setDropMessage("Title is too short");
            return;
        }

        if (title.trim().length > 32) {
            setDropMessage("Title is too long");
            return;
        }

        if (file === undefined) {
            setDropMessage("Image is not selected");
            return;
        }

        setUploading(true);
        const error = await API.uploadMeme(file, title);

        setUploading(false);
        setFile(undefined);
        setTitle("");

        if (error === null) {
            mutate(Config.restAddress + "/memes?page=" + currentPage);
            toast({
                title: "Upload success",
                description: "Your meme has been successfuly uploaded",
                status: "success",
                duration: 6000,
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }

        toast({
            title: error === "Unauthorized" ? "Login required" : "Upload error",
            description:
                error === "Unauthorized"
                    ? "You must be logged in to do that"
                    : error,
            status: "error",
            duration: 6000,
            isClosable: true,
            position: "bottom-right",
        });
    };

    return (
        <UI.VStack
            padding="15px"
            width="100%"
            backgroundColor={Config.BackgroundDarker}
            marginBottom="20px"
            spacing="10px"
            borderRadius="15px"
        >
            <UI.Text fontSize="2xl" fontWeight="bold" marginTop="-10px">
                Upload your meme
            </UI.Text>

            <UI.Input
                maxWidth="85%"
                type="text"
                placeholder={isOpen ? "Title" : "Title (click here to expand)"}
                transition="border-color 0.25s ease"
                _hover={{
                    borderColor: Config.Accent,
                }}
                _focus={{
                    borderColor: Config.Accent,
                }}
                onFocus={() => {
                    if (!isOpen) {
                        onToggle();
                    }
                }}
                onChange={(event) => {
                    setTitle(event.target.value);
                }}
                value={title}
                required
            />

            <UI.Center width="100%">
                <UI.Collapse
                    in={isOpen}
                    animateOpacity
                    style={{ width: "85%" }}
                >
                    <UI.VStack width="100%" spacing="10px">
                        <UI.Center
                            width="100%"
                            height="150px"
                            borderWidth="1px"
                            borderStyle="dashed"
                            borderRadius="5px"
                            transition="border-color 0.15s ease"
                            _hover={{
                                borderColor: Config.Accent,
                            }}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <UI.Icon
                                as={FaFileUpload}
                                width="26px"
                                height="26px"
                                marginRight="8px"
                            />
                            <UI.Text fontSize="xl" fontWeight="bold">
                                {isDragActive
                                    ? "Drop your meme here"
                                    : "Select your meme"}
                            </UI.Text>
                        </UI.Center>
                        <UI.Button
                            width="130px"
                            fontSize="lg"
                            color={Config.Text}
                            variant="outline"
                            onClick={upload}
                            isLoading={uploading}
                            loadingText="Uploading"
                            transition="border-color 0.15s ease"
                            _hover={{
                                borderColor: Config.Accent,
                            }}
                        >
                            Upload
                        </UI.Button>

                        <UI.Text fontSize="lg">{dropMessage}</UI.Text>
                    </UI.VStack>
                </UI.Collapse>
            </UI.Center>
        </UI.VStack>
    );
};
