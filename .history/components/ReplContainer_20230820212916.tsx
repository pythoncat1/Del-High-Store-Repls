import { rcss, icons, Surface, Text } from "../rui";
import { useNavigate } from "react-router-dom";
import gql from "../components/gql";

// Implement deletion history, restoring
// using localStorage

const ReplContainer = (replData, SID: string, handleDeleteRepl) => {
  SID = replData.SID;
  replData = replData.replData;

  const bytesToGiB = (bytes: number) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <li css={[rcss.flex.row, { height: "fit-content" }]}>
      <a
        href={`https://replit.com${replData.repl.url}`}
        css={[rcss.flex.row, { textDecoration: "none", width: "100%", overflowX: "auto" }]}
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
