import { css } from "@emotion/react";
import { rcss, tokens } from "./themes";
import { Text } from "./Text";
import { Tooltip } from "./Tooltip";

interface Props {
  className?: string;
  /** Name of badge to be displayed */
  name: string;
  /** Tagline of badge (used as aria title attribute) */
  tagline?: string;
  /** Color of badge to be displayed */
  color?: string;
}

type SubProps = Omit<Props, "name" | "color">;

const getColor = (color: string | undefined) => {
  if (color === undefined) {
    return tokens.foregroundDefault;
  }

  return `var(--accent-${color}-strongest)`;
};

const getBackgroundColor = (color: string | undefined) => {
  if (color === undefined) {
    return tokens.backgroundDefault;
  }

  return `var(--accent-${color}-dimmer)`;
};

const DefaultLabel = ({ tagline, name, color, className }: Props) => (
  <Tooltip
    tooltip={
      <Text variant="small" multiline>
        {tagline}
      </Text>
    }
  >
    <span
      className={className}
      css={[
        rcss.fontSize(tokens.fontSizeSmall),
        rcss.borderRadius(16),
        rcss.display.inlineBlock,
        rcss.cursor.default,
        {
          lineHeight: 1,
          padding: `${tokens.space4} ${tokens.space8}`,
          whiteSpace: "nowrap" as "nowrap",
          color: getColor(color),
          backgroundColor: getBackgroundColor(color),
        },
      ]}
    >
      {name}
    </span>
  </Tooltip>
);

const AdminLabel = ({ tagline }: SubProps) => (
  <DefaultLabel tagline={tagline ?? "Admin"} name="Admin" color="yellow" />
);

const DetectiveLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Detective"}
    name="Detective"
    color="green"
  />
);

const FeaturedUserLabel = ({ tagline }: SubProps) => (
  <DefaultLabel tagline={tagline ?? "Verified"} name="Verified" color="blue" />
);

const HackerLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Hackers are subscribed to Replit's paid Hacker Plan."}
    name="Hacker"
    color="green"
  />
);

const hackerProGradient = `radial-gradient(circle at top left, var(--accent-blurple-dimmest) 34%,  var(--accent-blurple-dimmer) 50%, var(--accent-blurple-dimmest) 66%)`;

const hackerProPillCss = css({
  backgroundImage: hackerProGradient,
  backgroundSize: "300% 100%",
  backgroundPosition: "left",
  ":hover": {
    backgroundPosition: "right",
    transition: "background-position 600ms ease-in-out",
  },
});

const ProLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Pro users are subscribed to Replit's paid Pro Plan."}
    name="Pro"
    color="blurple"
    css={hackerProPillCss}
  />
);

const LanguageJammerLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Language Jammer"}
    name="Language Jammer"
    color="purple"
  />
);

const ModeratorLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    // "Moderators" are called "Community moderators"
    // on user-facing surfaces.
    tagline={tagline ?? "Community Moderator"}
    name="Community Moderator"
    color="teal"
  />
);

const ReplitRepLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Replit Rep"}
    name="Replit Rep"
    color="pink"
  />
);

const ReplitRepEduLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Replit Rep EDU"}
    name="Replit Rep EDU"
    color="green"
  />
);

const PatronLabel = ({ tagline }: SubProps) => (
  <DefaultLabel tagline={tagline ?? "Patron"} name="Patron" color="purple" />
);

const PythonistaLabel = ({ tagline }: SubProps) => (
  <DefaultLabel
    tagline={tagline ?? "Pythonista"}
    name="Pythonista"
    color="teal"
  />
);

export const Label = {
  Default: DefaultLabel,
  Admin: AdminLabel,
  Detective: DetectiveLabel,
  Featured: FeaturedUserLabel,
  Hacker: HackerLabel,
  Pro: ProLabel,
  LanguageJammer: LanguageJammerLabel,
  Moderator: ModeratorLabel,
  ReplitRep: ReplitRepLabel,
  ReplitRepEdu: ReplitRepEduLabel,
  Patron: PatronLabel,
  Pythonista: PythonistaLabel,
};
