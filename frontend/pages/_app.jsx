import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { Navbar } from "../core/components/navbar";
import { Profile } from "../core/components/profile";
import { Recommendations } from "../core/components/recommendations";
import { createBreakpoints } from "@chakra-ui/theme-tools";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const theme = UI.extendTheme({
    useSystemColorMode: false,
    initialColorMode: "dark",
    styles: {
        global: (props) => ({
            body: {
                margin: 0,
                padding: 0,
                bg: Config.Background,
                color: Config.Text,
            },
            "#nprogress .bar": {
                bg: Config.Accent,
            },
        }),
    },
    breakpoints: createBreakpoints({
        sm: "30em",
        md: "54em",
        lg: "62em",
        xl: "80em",
        "2xl": "128em",
    }),
});

const App = ({ Component, pageProps }) => {
    return (
        <UI.ChakraProvider theme={theme}>
            <Navbar />
            <UI.Box
                marginLeft={{
                    base: "0",
                    lg: "10%",
                    xl: "19%",
                    "2xl": "27%",
                }}
                marginRight={{
                    base: "0",
                    lg: "10%",
                    xl: "19%",
                    "2xl": "27%",
                }}
                padding="15px"
            >
                <UI.Flex height="100%" width="100%" paddingTop="75px">
                    <UI.Box width={{ base: "100%", md: "60%" }}>
                        <Component {...pageProps} />
                    </UI.Box>
                    <UI.VStack
                        position="fixed"
                        display={{ base: "none", md: "block" }}
                        width={{ base: "40%", "2xl": "24%" }}
                        right={{ base: "0", "2xl": "20%" }}
                    >
                        <Profile />
                        <Recommendations />
                    </UI.VStack>
                </UI.Flex>
            </UI.Box>
        </UI.ChakraProvider>
    );
};

export default App;

/*<UI.Text
    color={{
        base: "red",
        sm: "green",
        md: "pink",
        lg: "purple",
        xl: "cyan",
        "2xl": "white",
    }}
>
    BREAKPOINT DEBUG
</UI.Text>*/
