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
import { filledAndOutlined } from "../rui/Colorway";

// Implement deletion history, restoring
// using localStorage

type Data = {
  replData: GraphQLTypes.ManageAccountStorageUtilizationCurrentUserQuery["currentUser"]["storageInfo"]["accountStorageUtilization"]["perRepl"];
  SID: string;
  handleDeleteRepl: HandleDeleteReplType;
};

type HandleDeleteReplType = (replID: string) => GraphQLTypes.DeleteReplMutation;

const StatPill = ({
  title,
  icon,
  value,
  color,
}: {
  title: string;
  icon: React.ReactElement;
  value: number | string;
  color: string;
}): JSX.Element => {
  return (
    <div
      css={[
        rcss.ml(32),
        rcss.flex.row,
        rcss.rowWithGap(8),
        rcss.p(4),
        { width: "fit-content", alignItems: "center" },
      ]}
    >
      <Text>{title}:</Text>
      <Pill
        iconLeft={icon}
        text={value}
        colorway={color}
        css={[rcss.fontSize("small")]}
      />
    </div>
  );
};

const ReplContainer = (data: Data) => {
  const SID: string = data.SID;
  const replData: PerReplData = data.replData;
  const handleDeleteRepl: HandleDeleteReplType = data.handleDeleteRepl;
  console.log(replData);

  const bytesToGiB = (bytes: number) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <li css={[rcss.flex.row, rcss.rowWithGap(8)]}>
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
        <AccordionItem
          headerContent={<Text>Stats</Text>}
          css={[rcss.ml(48), { width: "fit-content" }]}
        >
          <StatPill
            title="Likes"
            icon={<icons.Heart />}
            value={replData.repl.likeCount}
            color="pink"
          />
          <StatPill
            title="Comments"
            icon={<icons.Chat />}
            value={replData.repl.commentCount}
            color="blue"
          />
          <StatPill
            title="Runs"
            icon={<icons.Play />}
            value={replData.repl.runCount}
            color="green"
          />
          <StatPill
            title="Forks"
            icon={<icons.ForkRight />}
            value={replData.repl.publicForkCount}
            color="purple"
          />
          <StatPill
            title="Tips"
            icon={<icons.Cycles />}
            value={replData.repl.totalCyclesTips}
            color="orange"
          />
        </AccordionItem>
      </AccordionItem>
    </li>
  );
};

export default ReplContainer;
