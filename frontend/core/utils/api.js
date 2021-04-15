import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";

import useSWR, { mutate } from "swr";

export const useVote = () => {
    const toast = UI.useToast();

    const vote = async (id, meme, plus) => {
        const { data, error } = await sendAuthorizedRequest("/vote", "POST", {
            id: id,
            meme: meme,
            plus: plus,
        });

        if (error) {
            toast({
                title: "Login required",
                description: "You must be logged in to do that",
                status: "error",
                duration: 6000,
                isClosable: true,
                position: "bottom-right",
            });

            return undefined;
        }

        return { newVotes: data.newVotes, newState: data.newState };
    };

    return vote;
};

export const logout = async () => {
    await sendAuthorizedRequest("/logout", "GET");
    refreshSessionState();
};

export const useUser = () => {
    const { data, error } = useSWR(
        Config.restAddress + "/user",
        authorizedFetcher
    );

    const loading = !data && !error;

    return {
        loading,
        user: data,
    };
};

export const uploadMeme = async (file, title) => {
    console.log(file);
    if (unauthorized) {
        return "Unauthorized";
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const response = await fetch(Config.restAddress + "/upload_meme", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: formData,
    });

    if (response.status === 401 || response.status === 403) {
        return "Unauthorized";
    }

    const json = await response.json();
    if (json.success === true) {
        return null;
    }

    return json.message;
};

let unauthorized = false;
export const sendAuthorizedRequest = async (
    endpoint,
    method,
    body = undefined
) => {
    if (unauthorized) {
        const error = new Error("Unauthorized");
        error.status = 401;
        return { data: undefined, error: error };
    }

    const request = {
        method: method,
        mode: "cors",
        credentials: "include",
    };

    if (body !== undefined) {
        request.headers = {
            "Content-Type": "application/json",
        };

        request.body = JSON.stringify(body);
    }

    const response = await fetch(Config.restAddress + endpoint, request);
    if (response.status === 401 || response.status === 403) {
        unauthorized = true;
        const error = new Error("Unauthorized");
        error.status = 401;
        return { data: undefined, error: error };
    }

    if (!response.ok && response.status !== 401 && response.status !== 403) {
        const error = new Error("An error occurred while fetching the data.");
        error.status = response.status;
        error.info = await response.json();
        return { data: undefined, error: error };
    }

    const json = await response.json();
    return {
        data: json,
        error: undefined,
    };
};

export const authorizedFetcher = async (url) => {
    let endpoint = "/" + url.split("/")[url.split("/").length - 1];

    const { data, error } = await sendAuthorizedRequest(endpoint, "GET");
    if (error !== undefined) {
        throw error;
    }

    return data;
};

export const refreshSessionState = () => {
    unauthorized = false;
    mutate(Config.restAddress + "/user");
};
