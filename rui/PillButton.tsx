import * as React from "react";

import { SpecializedView } from "./View";
import { pillStyles, PillProps } from "./Pill";

const ButtonView = SpecializedView.button;

export interface PillButtonProps extends PillProps<HTMLButtonElement> {
  innerRef?: React.ForwardedRef<HTMLButtonElement>;
  /**
   * @private
   */
  children?: never;
}

/**
 * The same as Pill but a button
 */
export function PillButton({
  iconLeft,
  iconRight,
  text,
  innerRef,
  colorway,
  ...props
}: PillButtonProps) {
  return (
    <ButtonView
      ref={innerRef}
      {...props}
      css={[
        pillStyles({
          colorway,
          clickable: true,
          iconLeft: !!iconLeft,
          iconRight: !!iconRight,
        }),
        { color: "inherit" },
      ]}
    >
      {iconLeft}
      <span>{text}</span>
      {iconRight}
    </ButtonView>
  );
}
