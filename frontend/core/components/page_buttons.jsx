import * as UI from "@chakra-ui/react";
import * as Config from "../config.json";
import { useRouter } from "next/router";

export const PageButtons = (props) => {
    const { page, pages, switchTo } = props;
    const previousPageText = UI.useBreakpointValue({
        base: "Previous",
        md: "Previous page",
    });

    const nextPageText = UI.useBreakpointValue({
        base: "Next",
        md: "Next page",
    });

    return (
        <UI.HStack
            paddingLeft="7%"
            paddingRight="7%"
            marginBottom="10px"
            width="100%"
        >
            <PageButton
                redirectTo={page - 1}
                lastPage={pages}
                text={previousPageText}
                switchTo={switchTo}
            />
            <UI.Spacer />
            <UI.Text fontSize={{ base: "2xl", md: "30px" }} fontWeight="bold">
                {page + 1}
            </UI.Text>
            <UI.Spacer />
            <PageButton
                redirectTo={page + 1}
                maxPages={pages}
                text={nextPageText}
                switchTo={switchTo}
            />
        </UI.HStack>
    );
};

const PageButton = (props) => {
    const { redirectTo, maxPages, text, switchTo } = props;
    const router = useRouter();

    return (
        <UI.Button
            variant="outline"
            width="40%"
            height="45px"
            borderColor={Config.Text}
            color={Config.Text}
            disabled={redirectTo === -1 || redirectTo === maxPages}
            _hover={{
                color: Config.Accent,
                borderColor: Config.Accent,
            }}
            onClick={() => {
                router.push(switchTo.replace("{page}", redirectTo));
            }}
        >
            {text}
        </UI.Button>
    );
};
