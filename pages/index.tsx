import type {NextPage} from "next";
import * as React from "react";
import gql from "../components/gql";
import ReplContainer from "../components/ReplContainer";
import {Button, icons, Input, rcss, Surface, Text} from "../rui";
import ReplitIcon from "../components/ReplitIcon";

const Home: NextPage = () => {
    const [SID, setSID] = React.useState<string>(
        String(
            typeof window !== "undefined"
                ? (localStorage.getItem("SID") !== "undefined"
                ? localStorage.getItem("SID")
                : "") || ""
                : ""
        )
    );

    const [repls, setRepls] = React.useState<any>(null);
    const [theme, setTheme] = React.useState<any>(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme) {
                return JSON.parse(storedTheme);
            }
        }
        return "";
    });

    const [navBarCSS, setNavBarCSS] = React.useState([
        rcss.flex.column,
        rcss.p(8),
        {margin: "auto", justifyContent: "center", alignItems: "center"},
    ]);
    const [useTitleBar, setUseTitleBar] = React.useState<boolean>(false);
    const [loginMessage, setLoginMessage] = React.useState<string>(null);
    const [test, setTest] = React.useState();
    const [loggedIn, setLoggedIn] = React.useState(false);

    const testQuery = async () => {
        let test = await gql("testQuery", SID);
        return test;
    };

    const isValidSID = async () => {
        let test = await testQuery();
        return test?.currentUser?.id;
    };

    const getRepls = async () => {
        let data = await gql("getRepls", SID);
        let perReplData =
            data.currentUser.storageInfo.accountStorageUtilization.perRepl;
        let top20Values = perReplData
            .sort((a: any, b: any) => Number(b.usage) - Number(a.usage))
            .slice(0, 20);
        setRepls(top20Values);
    };

    const getTheme = async () => {
        let data = await gql("getTheme", SID);
        setTheme(data.currentUser.activeThemeVersion);
    };

    const getData = async () => {
        let isSIDValid = await isValidSID();
        if (isSIDValid) {
            setLoginMessage(null);
            setLoggedIn(true);
            await Promise.all([getRepls(), getTheme()]);
            setNavBarCSS([
                rcss.flex.row,
                rcss.rowWithGap(4),
                rcss.p(8),
                {
                    justifyContent: "center",
                    borderBottom: "1px solid var(--outline-dimmest)",
                    width: "100vw",
                    alignItems: "center",
                },
            ]);
            setUseTitleBar(true);
            localStorage.setItem("SID", SID);
        } else {
            setLoginMessage("Invalid SID.");
        }
    };

    React.useEffect(() => {
        if (theme) {
            localStorage.setItem("theme", JSON.stringify(theme));
        }
    }, [theme]);

    return (
        <>
            {theme && (
                <style jsx global>
                    {`
                      body {
                        color-scheme: ${theme.customTheme.colorScheme};
                        ${Object.entries(theme.values?.global || {})
                                .filter(([key]) => key !== "__typename")
                                .map(
                                        ([key, value]) =>
                                                `--${key.replace(
                                                        /[A-Z]/g,
                                                        (char) => "-" + char.toLowerCase()
                                                )}: ${value};`
                                )
                                .join("\n")}
                      }
                    `}
                </style>
            )}
            <Surface
                background="root"
                css={[
                    rcss.color("foregroundDefault"),
                    {width: "100vw", height: "100vh"},
                ]}
            >
                <div css={navBarCSS}>
                    <div
                        css={[
                            rcss.flex.row,
                            rcss.rowWithGap(8),
                            rcss.p(8),
                            {alignItems: "center"},
                        ]}
                    >
                        <ReplitIcon/>
                        <Text css={[rcss.color("foregroundDefault")]}>
                            High Storage Repls Deleter
                        </Text>
                    </div>

                    <div css={[rcss.flex.row, rcss.rowWithGap(4), {margin: "auto"}]}>
                        <Input
                            placeholder="SID"
                            type="password"
                            value={SID}
                            onChange={(e) => {
                                setSID(e.target.value);
                            }}
                        />
                        {!loggedIn ? (
                            <Button
                                colorway="primary"
                                css={[rcss.color("foregroundDefault")]}
                                iconRight={<icons.ArrowRight/>}
                                text="Log In"
                                onClick={getData}
                                outlined={true}
                                stretch={true}
                                // disabled={!SID}
                            />
                        ) : (
                            <Button
                                iconLeft={
                                    <icons.RefreshCw css={[rcss.color("foregroundDefault")]}/>
                                }
                                text="Refresh"
                                onClick={getData}
                                outlined={true}
                                // disabled={!SID}
                            />
                        )}
                    </div>
                    {loginMessage && (
                        <Text css={[rcss.color("accentNegativeDefault"), rcss.p(8)]}>
                            {loginMessage}
                        </Text>
                    )}
                </div>
                <div css={[rcss.flex.row]}>
                    <div
                        css={[
                            rcss.flex.column,
                            rcss.rowWithGap(0),
                            {width: "100%", height: "100%"},
                        ]}
                    >
                        {repls && repls.length > 0 ? (
                            <ul>
                                {repls.map((repl: any) => (
                                    <ReplContainer key={repl.id} replData={repl} SID={SID}/>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </Surface>
        </>
    );
};

export default Home;