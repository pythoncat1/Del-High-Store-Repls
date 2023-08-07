import * as React from "react";
// eslint-disable-next-line import/no-restricted-paths
import { Space, rcss } from "./themes/tokens";
import { tokens } from "./themes";
import { cssRecord } from "./cssRecord";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { View } from "./View";

export interface AvatarProps {
  /** Image url. If null, initials are displayed */
  src: string | null;
  /** Username of the person. Might be used to extract initials when `src` is null */
  username: string;
  /** Full name of the person (first + last). Used to extract initials when `src` is null */
  fullName?: string;
  /** How big is the avatar */
  size?: Space;
  /** If set, the avatar is going to have 2px outline with the given color (e.g. for multiplayer) */
  ringColor?: string;
  /** Called when the user clicks, taps or uses keyboard to activate the avatar */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Used to accept styling via css prop */
  className?: string;
  /** Layout behavior of the image */
  layout?: "intrinsic" | "fixed" | "responsive" | "fill";
  /** Called when there's an error loading the provided src  */
  onError?: JSX.IntrinsicElements["img"]["onError"];
}

const styleTokens = {
  size: "--size",
  ringSize: "--ring-size",
  ringColor: "--ring-color",
  hasOnClickShadow: "--has-on-click-shadow",
};

const styleVars = {
  size: `var(${styleTokens.size})`,
  ringSize: `var(${styleTokens.ringSize})`,
  ringColor: `var(${styleTokens.ringColor})`,
  hasOnClickShadow: `var(${styleTokens.hasOnClickShadow})`,
};

const style = cssRecord({
  container: [
    {
      borderRadius: tokens.borderRadiusRound,
      overflow: "hidden",
      width: styleVars.size,
      height: styleVars.size,
      backgroundColor: tokens.outlineDimmest,
      position: "relative",
      "&::before": {
        borderRadius: "50%",
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxShadow: `inset 0 0 0 ${styleVars.ringSize} ${styleVars.ringColor}`,
        zIndex: 1,
      },
      "&:active::before": {
        boxShadow: `inset 0 0 0 ${styleVars.ringSize} ${tokens.outlineStrongest}`,
      },
      "&:hover::before": {
        boxShadow: styleVars.hasOnClickShadow,
      },
    },
  ],
  initials: [
    rcss.flex.growAndShrink(1),
    rcss.center,
    rcss.color("foregroundDimmest"),
    { fontSize: `calc(${styleVars.size} / 2.5)` },
  ],
});

export function Avatar({
  src,
  username,
  fullName,
  size = 32,
  layout = "intrinsic",
  ringColor,
  onError,
  ...props
}: AvatarProps) {
  const ringSize = ringColor ? 2 : 1;
  const color = ringColor ? ringColor : tokens.outlineDimmer;
  const onClickShadow = props.onClick
    ? `inset 0 0 0 ${styleVars.ringSize} ${tokens.outlineDefault}`
    : `inset 0 0 0 ${styleVars.ringSize} ${styleVars.ringColor}`;

  return (
    <View
      css={style.container}
      style={{
        [styleTokens.size]: size + "px",
        [styleTokens.ringSize]: ringSize + "px",
        [styleTokens.ringColor]: color,
        [styleTokens.hasOnClickShadow]: onClickShadow,
      }}
      {...props}
    >
      {src ? (
        <img
          title={username}
          width={size}
          height={size}
          alt={username}
          src={src}
          onError={onError}
        />
      ) : (
        <>
          <VisuallyHidden>{fullName}</VisuallyHidden>
          <View css={style.initials} aria-hidden="true">
            {guessInitials(username, fullName)}
          </View>
        </>
      )}
    </View>
  );
}

function guessInitials(username: string, fullName?: string) {
  if (!fullName) {
    return username.toUpperCase().slice(0, 2);
  }

  const parts = fullName.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return fullName.toUpperCase().slice(0, 2);
}
