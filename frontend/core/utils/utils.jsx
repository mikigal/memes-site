import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";

import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

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

export const VoteButton = (props) => {
    const { plus, size, voted, onClick } = props;
    let colored =
        (plus === "true" && voted === true) ||
        (plus === "false" && voted === false);

    let border = "1px solid " + Config.Text;
    if (colored) {
        border = "1px solid " + Config.Accent;
    }

    return (
        <UI.Flex
            width={size}
            height={size}
            justifyContent="center"
            alignItems="center"
            border={border}
            borderRadius="5px"
            color={colored ? Config.Accent : Config.Text}
            transition="color 0.15s ease, border-color 0.15s ease"
            _hover={{
                color: Config.Accent,
                borderColor: Config.Accent,
            }}
            onClick={onClick}
        >
            <UI.Icon
                as={plus === "true" ? AiOutlinePlus : AiOutlineMinus}
                fontSize="lg"
            />
        </UI.Flex>
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
