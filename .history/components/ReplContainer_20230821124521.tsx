import { rcss, icons, Surface, Text, IconButton, AccordionItem } from "../rui";
import { useNavigate } from "react-router-dom";
import gql from "../components/gql";
import * as GraphQLTypes from "../components/types";
import Image from "next/image";

// Implement deletion history, restoring
// using localStorage

type PerReplData = {
  usage: number;
  percentage: number;
  repl: {
    id: string;
    slug: string;
    url: string;
    title: string;
    nextPagePathname: string;
    iconUrl: string;
  };
};

type Data = {
  replData: PerReplData;
  SID: string;
  handleDeleteRepl: HandleDeleteReplType;
};

type HandleDeleteReplType = (replID: string) => GraphQLTypes.DeleteReplMutation;

const ReplContainer = (data: Data) => {
  const SID: string = data.SID;
  const replData: PerReplData = data.replData;
  const handleDeleteRepl: HandleDeleteReplType = data.handleDeleteRepl;

  const bytesToGiB = (bytes: number) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <li
      css={[
        rcss.flex.row,
        rcss.rowWithGap(8),
        { height: "fit-content", maxHeight: "40px", alignItems: "center" },
      ]}
    >
      <AccordionItem
        css={[
          rcss.flex.row,
          rcss.rowWithGap(8),
          { height: "fit-content", maxHeight: "40px", alignItems: "center" },
        ]}
        headerContent={<>
        </>}
      >
        
      </AccordionItem>
    </li>
  );
};

export default ReplContainer;
