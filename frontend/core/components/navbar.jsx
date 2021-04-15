import * as UI from "@chakra-ui/react";

import * as Config from "../config.json";

import { BellIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";

export const Navbar = () => {
    const logo = UI.useBreakpointValue({
        base: "/logo-min.png",
        md: "/logo.png",
    });

    return (
        <UI.Flex
            width="100vw"
            height="55px"
            position="fixed"
            justifyContent="space-evenly"
            backgroundColor={Config.BackgroundDarker}
            zIndex="10"
        >
            <Link href="/">
                <a>
                    <UI.Image src={logo} />
                </a>
            </Link>

            <UI.HStack spacing="0">
                <NavbarEntry target="/" name="Home" />
                <NavbarSeparator />
                <NavbarEntry target="/newest" name="Newest" />
                <NavbarSeparator />
                <NavbarEntry target="/top" name="Top" />
                <NavbarSeparator />

                <UI.Box>
                    <BellIcon fontSize={{ base: "25px", lg: "30px" }} />

                    <UI.Box
                        width={{ base: "8px", lg: "9px" }}
                        height={{ base: "8px", lg: "9px" }}
                        position="fixed"
                        zIndex="11"
                        marginTop={{ base: "-21px", lg: "-26px" }}
                        marginLeft={{ base: "13px", lg: "17px" }}
                        borderRadius="360"
                        backgroundColor="red"
                    ></UI.Box>
                </UI.Box>
            </UI.HStack>
        </UI.Flex>
    );
};

const NavbarEntry = (props) => {
    let router = useRouter();
    let { name, target } = props;

    return (
        <UI.Text
            fontSize={{ base: "lg", lg: "xl" }}
            transition="color 0.15s ease"
            color={router.asPath == target ? Config.Accent : Config.Text}
            _hover={{ color: Config.Accent }}
        >
            <Link href={target}>{name}</Link>
        </UI.Text>
    );
};

const NavbarSeparator = () => {
    return (
        <UI.Text fontWeight="light" paddingLeft="15px" paddingRight="15px">
            |
        </UI.Text>
    );
};
