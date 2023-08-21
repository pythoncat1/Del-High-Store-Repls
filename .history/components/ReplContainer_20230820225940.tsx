import { rcss, icons, Surface, Text } from "../rui";
import { useNavigate } from "react-router-dom";
import gql from "../components/gql";
import * as GraphQLTypes from "../components/types";

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

const ReplContainer = (
  data: Data,
  //SID: string,
  //handleDeleteRepl: HandleDeleteReplType
) => {
  const SID = data.SID;
  const replData = data.replData;
  const handleDeleteRepl: HandleDeleteReplType = data.handleDeleteRepl;

  const bytesToGiB = (bytes: number) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <li css={[rcss.flex.row, { height: "fit-content" }]}>
      <a
        href={`https://replit.com${replData.repl.url}`}
        css={[
          rcss.flex.row,
          { textDecoration: "none", width: "100%", overflowX: "auto" },
        ]}
      >
        <img
          src={replData.repl.iconUrl}
          css={[
            rcss.borderRadius(4),
            { border: "1px solid var(--outline-default)" },
          ]}
          width="16px"
          height="16px"
        />
        <Text
          css={[rcss.color("foregroundDefault"), { textDecoration: "none" }]}
        >
          {replData.repl.title}
        </Text>
        <svg width="100%" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="var(--outline-default)"
          ></line>{" "}
          {/* svg 20px height fixed? */}
        </svg>
        <Text css={[rcss.color("foregroundDefault")]}>
          {bytesToGiB(replData.usage).toFixed(4)} GiB
        </Text>
      </a>
    </li>
  );
};

export default ReplContainer;
