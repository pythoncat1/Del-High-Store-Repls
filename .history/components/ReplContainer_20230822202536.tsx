import {
  rcss,
  icons,
  Surface,
  Text,
  IconButton,
  AccordionItem,
  Pill,
} from "../rui";
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
    description: string;
    likeCount: number;
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
  console.log(replData);

  const bytesToGiB = (bytes: number) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <li
      css={[
        rcss.flex.row,
        rcss.rowWithGap(8),
        { height: "fit-content", alignItems: "center" },
      ]}
    >
      <AccordionItem
        headerContent={
          <div
            css={[
              rcss.flex.row,
              rcss.rowWithGap(8),
              {
                height: "fit-content",
                maxHeight: "48px",
                alignItems: "center",
              },
            ]}
          >
            <a
              href={`https://replit.com${replData.repl.url}`}
              css={[
                rcss.flex.row,
                rcss.rowWithGap(8),
                { textDecoration: "none", width: "64vw", alignItems: "center" },
              ]}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={replData.repl.iconUrl}
                alt="image"
                css={[
                  rcss.borderRadius(4),
                  { border: "1px solid var(--outline-default)" },
                ]}
                width="32px"
                height="32px"
              />
              <Text
                css={[
                  rcss.color("foregroundDefault"),
                  { textDecoration: "none" },
                ]}
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
                ></line>
              </svg>
              <Text css={[rcss.color("foregroundDefault")]}>
                {bytesToGiB(replData.usage).toFixed(4)} GiB
              </Text>
            </a>
            <IconButton
              alt={`Delete ${replData.repl.title}`}
              size={28}
              onClick={() => handleDeleteRepl(replData.repl.id)}
              disabled
            >
              <icons.Trash />
            </IconButton>
          </div>
        }
        css={[rcss.flex.column, rcss.colWithGap(8)]}
      >
        <AccordionItem
          headerContent={<Text>Description</Text>}
          css={[rcss.ml(48), { width: "fit-content" }]}
        >
          <Text multiline css={[rcss.ml(32), { width: "48vw" }]}>
            {replData.repl.description}
          </Text>
        </AccordionItem>
        <AccordionItem
          headerContent={<Text>View Repl</Text>}
          css={[rcss.ml(48), { width: "fit-content" }]}
        >
          <iframe
            src={`https://replit.com${replData.repl.url}?v=1&embed=1`}
            css={[
              rcss.borderRadius(8),
              rcss.ml(32),
              { border: "none", height: "48vh", width: "48vw" },
            ]}
          />
        </AccordionItem>
        <div
          css={[
            rcss.ml(48),
            rcss.flex.row,
            rcss.rowWithGap(8),
            rcss.p(4),
            { width: "fit-content", alignItems: "center" },
          ]}
        >
          <Text>Likes:</Text>
          <Pill text={replData.repl.likeCount.toString()} colorway="pink" css={[{fontSize: "var(--font-size-small)"}]} />
        </div>
      </AccordionItem>
    </li>
  );
};

export default ReplContainer;
