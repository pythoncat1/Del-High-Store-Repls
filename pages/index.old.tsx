import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import gql from "../components/gql";
import ThemeContainer from "../components/ThemeContainer";

const Home: NextPage = () => {
  const [SID, setSID] = React.useState("");
  const [inputThemeID, setInputThemeID] = React.useState("");

  const [themeData, setThemeData] = React.useState({});
  const [themes, setThemes] = React.useState<any>([]);

  async function getThemeData() {
    let data = await gql("getThemes", SID, {
      authoredThemesInput: {
        count: 100,
      },
    });
    console.log(data);
    if (data.response.success && data.response.data.currentUser) {
      setThemeData(data.response);
      setThemes(data.response.data.currentUser.authoredThemes.items);
    }
  }
  return (
    <>
      <div className="h-12 bg-[#1C2333] flex justify-center items-center">
        <input
          className="p-1 px-2 mx-2 border border-[#3C445C] focus:border-[#4E5569] bg-transparent btn"
          placeholder="SID Token"
          value={SID}
          onChange={(e) => {
            setSID(e.target.value);
          }}
        ></input>
        <button
          className="p-1 px-2 mr-2 border border-[#3C445C] hover:border-[#4E5569] bg-transparent btn"
          onClick={() => {
            getThemeData();
          }}
        >
          Refresh
        </button>
        <div className="border-r border-[#4E5569] h-8"></div>
        <input
          className="p-1 px-2 mx-2 border border-[#3C445C] focus:border-[#4E5569] bg-transparent btn"
          placeholder="Theme ID"
          value={inputThemeID}
          onChange={(e) => {
            setInputThemeID(e.target.value);
          }}
        ></input>
        <button
          className="p-1 px-2 mr-2 border border-[#3C445C] hover:border-[#4E5569] bg-transparent btn"
          onClick={() => {
            gql("setActiveTheme", SID, {
              input: { themeId: parseInt(inputThemeID) },
            });
          }}
        >
          Set Active Theme
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col gap-2 p-2">
          {themes.map((theme: any) => (
            <ThemeContainer
              key={theme.id}
              themeData={{ theme }}
              sid={SID}
            ></ThemeContainer>
          ))}
        </div>
        <div>
          <p>-- Guide to using this tool --</p>

          <p>
            Enter connect.sid token in the input box at the top (Find out how to
            get it{" "}
            <a
              href="https://replit.com/talk/learn/How-to-Get-Your-SID-Cookie/145979"
              target="_blank"
              className="underline"
              rel="noreferrer"
            >
              here
            </a>
            )
            <br />
            After that, click &#34;Refresh&#34;.
            <br />
            You can inspect your saved themes now!
            <br />
            Edit the JSON Data of a theme by clicking on &#34;View JSON
            Data&#34;
            <br />
            Save the theme by clicking &#34;Save Theme&#34;
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
