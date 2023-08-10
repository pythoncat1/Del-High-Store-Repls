import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import gql from "../components/gql";
import ReplContainer from "../components/ReplContainer";
import { Surface, rcss } from "../rui";

const Home: NextPage = () => {
  const [SID, setSID] = React.useState<string>("");
  const [repls, setRepls] = React.useState<any>([]);

  const getRepls = async () => {
    let data = await gql("getRepls", SID);
    let perReplData =
      data.currentUser.storageInfo.accountStorageUtilization.perRepl;
    let top20Values = perReplData
      .sort((a: any, b: any) => Number(b.usage) - Number(a.usage))
      .slice(0, 20);
    setRepls(top20Values);
  };

  return (
    <>
      <input
        placeholder="SID"
        value={SID}
        onChange={(e) => {
          setSID(e.target.value);
        }}
      />
      <button onClick={getRepls}>Refresh</button>
      <Surface background="default" css={[rcss.flex.column]}>
        {repls && repls.map((repl: any, index: number) => (
          <ReplContainer replData={repl} SID={SID} />
        ))}
      </Surface>
      </>
  );
};

export default Home;