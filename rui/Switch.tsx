import React from "react";
import { useSwitch, AriaSwitchProps } from "@react-aria/switch";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useToggleState } from "@react-stately/toggle";
import { Text } from "./Text";
import { SpecializedView } from "./View";
import { rcss, tokens } from "./themes";
import { interactiveVars } from "./Interactive";

import { useFocusRing } from "@react-aria/focus";
import { useHover } from "@react-aria/interactions";
import { Colorway, colormap } from "./Colorway";
import { cssRecord } from "./cssRecord";

const Label = SpecializedView.label;

const css = cssRecord({
  label: [rcss.rowWithGap(8), rcss.align.center],
  background: { transition: "fill 100ms ease-out" },
  button: { transition: "x 100ms ease-out" },
  outline: { transition: "stroke 100ms ease-out" },
});

const backgroundFill = (
  theme: (typeof colormap)[Colorway],
  isSelected: boolean,
  isDisabled: boolean,
  isReadOnly: boolean
) => {
  if (!isSelected) {
    return interactiveVars.interactiveBorder;
  }

  if (isDisabled || isReadOnly) {
    return theme.dimmer;
  }

  return theme.default;
};

const outlineFill = (
  theme: (typeof colormap)[Colorway],
  isDisabled: boolean,
  isReadOnly: boolean,
  isHovered: boolean,
  isSelected: boolean
) => {
  if (!isHovered || isDisabled || isReadOnly) {
    return "transparent";
  }

  if (isSelected) {
    return theme.strongest;
  }

  return interactiveVars.interactiveBorderHover;
};

export interface SwitchProps extends AriaSwitchProps {
  colorway?: Colorway;
}

export const Switch = ({ colorway = "primary", ...props }: SwitchProps) => {
  const theme = colormap[colorway];

  const ref = React.useRef(null);
  const state = useToggleState(props);
  const { inputProps } = useSwitch(props, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const { isSelected } = state;

  const isDisabled = props.isDisabled || false;
  const isReadOnly = props.isReadOnly || false;

  const hasChildLabel = React.Children.count(props.children) > 0;
  const hasAriaLabel =
    props["aria-label"] !== undefined || props["aria-labelledby"] !== undefined;

  if (
    !hasChildLabel &&
    !hasAriaLabel &&
    process.env.NODE_ENV !== "production"
  ) {
    throw new Error("Switch must have a label");
  }

  const toggle = (
    <svg
      aria-hidden="true"
      {...hoverProps}
      width="40"
      height="24"
      viewBox="-1 -1 39 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow={isFocusVisible ? "visible" : "hidden"}
    >
      {/* background */}
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="21"
        rx="10.5"
        fill={backgroundFill(theme, isSelected, isDisabled, isReadOnly)}
        css={css.background}
      />
      {/* button */}
      <rect
        x={isSelected ? "17" : "3"}
        y="3"
        width="16"
        height="16"
        rx="8"
        fill={tokens.white}
        opacity={isDisabled ? 0.7 : 1}
        css={css.button}
      />
      {/* outline */}
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="21"
        rx="10.5"
        stroke={outlineFill(
          theme,
          isDisabled,
          isReadOnly,
          isHovered,
          isSelected
        )}
        css={css.outline}
      />
      {/* focus ring */}
      <rect
        x="-1"
        y="-1"
        width="38"
        height="24"
        rx="12"
        stroke={isFocusVisible ? theme.stronger : "transparent"}
        strokeWidth="2"
      />
    </svg>
  );

  if (hasChildLabel) {
    return (
      <Label css={css.label}>
        <VisuallyHidden>
          <input {...inputProps} {...focusProps} ref={ref} />
        </VisuallyHidden>
        {toggle}
        <Text>{props.children}</Text>
      </Label>
    );
  }

  // TODO: this shouldn't be rendered with a label element, but clicks don't work
  // when it's not
  return (
    <Label css={css.label}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      {toggle}
    </Label>
  );
};
