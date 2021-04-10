import * as UI from "@chakra-ui/react";
import * as Config from "../core/config.json";
import { Navbar } from "../core/navbar";
import { Profile } from "../core/sidebar";

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
                overflowX: "hidden",
            },
            "#nprogress .bar": {
                bg: Config.Accent,
            },
        }),
    },
});

const App = ({ Component, pageProps }) => {
    //TODO: Stick sidebar to right side, may need to modify breakpoints
    return (
        <UI.ChakraProvider theme={theme}>
            <UI.ColorModeScript
                initialColorMode={theme.config.initialColorMode}
            />
            <Navbar />
            <UI.Flex
                width="100vw"
                height="100%"
                justifyContent="center"
                top="75px"
                paddingLeft="20px"
                paddingRight="20px"
                position="fixed"
            >
                <UI.Box
                    width="100%"
                    height="100%"
                    maxWidth="700px"
                    overflowY="scroll"
                    css={{
                        "&::-webkit-scrollbar": {
                            width: "0px",
                        },
                        "&::-webkit-scrollbar-track": {
                            width: "0px",
                        },
                    }}
                >
                    <Component {...pageProps} />
                </UI.Box>

                <UI.VStack
                    display={{
                        base: "none",
                        xl: "block",
                    }}
                >
                    <Profile />
                </UI.VStack>
            </UI.Flex>
        </UI.ChakraProvider>
    );
};

export default App;

/*
<UI.Text
                fontSize="20px"
                color={{
                    base: "red",
                    sm: "green",
                    md: "blue",
                    lg: "white",
                    xl: "grey",
                    "2xl": Config.Accent,
                }}
            >
                xddddd
            </UI.Text>
*/
