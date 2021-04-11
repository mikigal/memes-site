import * as UI from "@chakra-ui/react";
import * as Config from "./config.json";

export const ErrorAlert = (props) => {
    const { title, description } = props;

    return (
        <UI.Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            color={Config.BackgroundDarker}
        >
            <UI.AlertIcon boxSize="40px" mr={0} />
            <UI.AlertTitle mt={4} mb={1} fontSize="lg">
                {title}
            </UI.AlertTitle>
            <UI.AlertDescription maxWidth="sm">
                {description}
            </UI.AlertDescription>
        </UI.Alert>
    );
};

export const timeSince = (date) => {
    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let year = day * 365;

    let suffix = " ago";

    let elapsed = Math.floor((Date.now() - date) / 1000);

    if (elapsed < minute) {
        return "just now";
    }

    let a = (elapsed < hour && [Math.floor(elapsed / minute), "minute"]) ||
        (elapsed < day && [Math.floor(elapsed / hour), "hour"]) ||
        (elapsed < month && [Math.floor(elapsed / day), "day"]) ||
        (elapsed < year && [Math.floor(elapsed / month), "month"]) || [
            Math.floor(elapsed / year),
            "year",
        ];

    return a[0] + " " + a[1] + (a[0] === 1 ? "" : "s") + suffix;
};

let unauthorized = false;
export const sessionFetcher = async () => {
    if (unauthorized) {
        const error = new Error("Unauthorized");
        error.status = 403;
        throw error;
    }

    const response = await fetch(Config.restAddress + "/user", {
        method: "GET",
        mode: "cors",
        credentials: "include",
    });

    if (response.status === 401 || response.status === 403) {
        unauthorized = true;
        const error = new Error("Unauthorized");
        error.status = 403;
        throw error;
    }

    if (!response.ok && response.status !== 401 && response.status !== 403) {
        const error = new Error("An error occurred while fetching the data.");
        error.status = response.status;
        error.info = await response.json();
        throw error;
    }

    return await response.json();
};

export const refreshSessionFetcher = () => {
    unauthorized = false;
};

export const fetcher = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error("An error occurred while fetching the data.");
        error.status = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json();
};
