// Moved to here because it doesn't work in RUI for some reason???
import React from "react";
import { css, keyframes } from "@emotion/react";
import { Props as IconProps } from "../rui/icons/Icon";
import LoaderIcon from "../rui/icons/Loader";

const rotation = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(359deg)" },
});

const rotate = css({
  animation: `${rotation} 1s linear infinite`,
});

export default function LoadingIcon(props: IconProps) {
  return <LoaderIcon {...props} css={rotate} />;
}