import * as UI from "@chakra-ui/react";
import { loremIpsum } from "lorem-ipsum";

export default function tos() {
    return (
        <UI.Box>
            <UI.Heading size="lg" textAlign="center" marginBottom="10px">
                Terms of Service
            </UI.Heading>

            {[...Array(5)].map((x, i) => (
                <UI.Text marginBottom="10px">
                    {loremIpsum({ count: 1, units: "paragraphs" })}
                </UI.Text>
            ))}
        </UI.Box>
    );
}
