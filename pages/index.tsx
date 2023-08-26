import type { NextPage } from "next";
import * as React from "react";
import gql from "../components/gql";
import ReplContainer from "../components/ReplContainer";
import { Button, icons, Input, rcss, Surface, Text } from "../rui";
import LoadingIcon from "../components/Loader";
import ReplitIcon from "../components/ReplitIcon";
import SettingsPopup from "../components/SettingsPopup";
import * as GraphQLTypes from "../components/types";

const Home: NextPage = () => {
  const [shouldSaveSID, setShouldSaveSID] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedSettings = localStorage.getItem("settings");
      if (storedSettings) {
        return JSON.parse(storedSettings).shouldSaveSID;
      }
    }
    return true;
  });
  const [SID, setSID] = React.useState<string>(() => {
    if (typeof window !== "undefined" && shouldSaveSID) {
      if (localStorage.getItem("SID") !== "undefined") {
        return localStorage.getItem("SID") || "";
      }
    }
    return "";
  });
  const [repls, setRepls] = React.useState<
    | null
    | GraphQLTypes.ManageAccountStorageUtilizationCurrentUserQuery["currentUser"]["storageInfo"]["accountStorageUtilization"]["perRepl"]
  >(null);
  const [shouldSaveTheme, setShouldSaveTheme] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedSettings = localStorage.getItem("settings");
      if (storedSettings) {
        return JSON.parse(storedSettings).shouldSaveTheme;
      }
    }
    return true;
  });
  const [theme, setTheme] = React.useState<GraphQLTypes.CurrentUserThemeQuery>(() => {
    if (typeof window !== "undefined" && shouldSaveTheme) {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return JSON.parse(storedTheme);
      }
    }
    return "";
  });
  const [navBarCSS, setNavBarCSS] = React.useState<Array<object>>([
    rcss.flex.column,
    rcss.p(8),
    { margin: "auto", justifyContent: "center", alignItems: "center" }
  ]);
  const [useTitleBar, setUseTitleBar] = React.useState<boolean>(false);
  const [loginMessage, setLoginMessage] = React.useState<string | null>(null);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [showLoader, setShowLoader] = React.useState<boolean>(false);
  const [replAmount, setReplAmount] = React.useState<number>(20);
  const [totalReplAmount, setTotalReplAmount] = React.useState<number>(0);

  const testQuery = async () => {
    let test: GraphQLTypes.TestQuery = await gql("testQuery", SID);
    return test;
  };

  const isValidSID = async () => {
    let test = await testQuery();
    return test?.currentUser?.id;
  };

  const getRepls = async () => {
    let data: GraphQLTypes.ManageAccountStorageUtilizationCurrentUserQuery = await gql(
      "getRepls",
      SID
    );
    let perReplData = data.currentUser.storageInfo.accountStorageUtilization.perRepl;

    let sortRepls = perReplData.sort(
      (a: any, b: any) => Number(b.usage) - Number(a.usage)
    );
    console.log(sortRepls);
    setRepls(sortRepls);
    setTotalReplAmount(perReplData.length);
  };

  const getTheme = async () => {
    let data: GraphQLTypes.CurrentUserThemeQuery = await gql("getTheme", SID);
    setTheme(data);
  };

  const getData = async () => {
    let isSIDValid = await isValidSID();
    if (isSIDValid) {
      setShowLoader(true);
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
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "var(--background-root)"
        },
        rcss.mb(8)
      ]);
      setUseTitleBar(true);
      if (shouldSaveSID) {
        localStorage.setItem("SID", SID);
      }
      setShowLoader(false);
    } else {
      setLoginMessage("Invalid SID.");
    }
  };

  const handleDeleteRepl = async (replID: string) => {
    let success: GraphQLTypes.DeleteReplMutation = await gql("deleteRepl", SID, {
      id: replID
    });
    return success;
  };

  React.useEffect(() => {
    if (shouldSaveTheme) {
      if (theme) {
        localStorage.setItem("theme", JSON.stringify(theme));
      }
    }
  }, [theme]);

  React.useEffect(() => {
    const settings = {
      shouldSaveSID,
      shouldSaveTheme
    };

    localStorage.setItem("settings", JSON.stringify(settings));
  }, [shouldSaveSID, shouldSaveTheme]);

  return (
    <>
      {theme && (
        <style jsx global>
          {`
            body {
              color-scheme: ${theme?.currentUser?.activeThemeVersion?.customTheme
                ?.colorScheme};
              ${Object.entries(
                theme?.currentUser?.activeThemeVersion?.values?.global || {}
              )
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
          { width: "100vw", height: "100vh", overflowY: "scroll", alignItems: "center" }
        ]}
      >
        <div css={navBarCSS}>
          <div
            css={[
              rcss.flex.row,
              rcss.rowWithGap(8),
              rcss.p(8),
              { alignItems: "center" }
            ]}
          >
            <ReplitIcon />
            <Text css={[rcss.color("foregroundDefault")]}>
              High Storage Repls Deleter
            </Text>
          </div>

          <div css={[rcss.flex.row, rcss.rowWithGap(4), { margin: "auto" }]}>
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
                iconRight={<icons.ArrowRight />}
                text="Log In"
                onClick={getData}
                stretch={true}
                // disabled={!SID}
              />
            ) : (
              <Button
                iconLeft={<icons.RefreshCw css={[rcss.color("foregroundDefault")]} />}
                text="Refresh"
                onClick={getData}
                colorway="primary"
                // disabled={!SID}
              />
            )}
          </div>
          {loginMessage && (
            <Text css={[rcss.color("accentNegativeDefault"), rcss.p(8)]}>
              {loginMessage}
            </Text>
          )}
          {showLoader && <LoadingIcon />}
        </div>
        {repls && repls.length > 0 && (
          <>
            <div css={[rcss.flex.column, rcss.colWithGap(8)]}>
              {repls.slice(0, replAmount).map((repl: any) => (
                <ReplContainer
                  key={repl.id}
                  replData={repl}
                  SID={SID}
                  handleDeleteRepl={(replID) => {
                    handleDeleteRepl(replID);
                    getRepls();
                  }}
                />
              ))}
            </div>
            {replAmount < totalReplAmount && (
              <Button
                colorway="primary"
                iconLeft={<icons.Plus />}
                text="Load More"
                onClick={() => setReplAmount(replAmount + 20)}
                stretch={true}
              />
            )}
          </>
        )}
        {loggedIn && (
          <SettingsPopup
            setTheme={setTheme}
            shouldSaveTheme={shouldSaveTheme}
            setShouldSaveTheme={setShouldSaveTheme}
            setSID={setSID}
            shouldSaveSID={shouldSaveSID}
            setShouldSaveSID={setShouldSaveSID}
          />
        )}
      </Surface>
    </>
  );
};

export default Home;
