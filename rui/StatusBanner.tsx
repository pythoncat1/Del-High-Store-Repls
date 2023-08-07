import * as React from "react";
import type { PressEvent } from "@react-types/shared";
import { Colorway, colormap } from "./Colorway";
import { Props as IconProps } from "./icons/Icon";
import { Text } from "./Text";
import { rcss, tokens } from "./themes";
import { View } from "./View";
import { Surface } from "./Surface";
import CloseIcon from "./icons/Close";
import { IconButton } from "./IconButton";

export interface StatusBannerProps {
  /** Useful in to associate a status banner with an input for a11y */
  id?: string;
  /** You can't pass children to a <Button>, but forwardRef tries to permit it unless forbidden.
   *
   * @private
   */
  children?: never;
  /** Sets the text of the StatusBanner */
  text: string | React.ReactNode;
  /** Icon on the left side of the StatusBanner */
  icon?: React.ReactElement<IconProps>;
  /** if the StatusBanner is closable */
  closable?: boolean;
  /** function to call when close icon is clicked */
  closeAction?: (event: PressEvent) => void;
  /** Allows customizing StatusBanner look via `css` prop */
  className?: string;
  /** Pick a pre-defined color to communicate the purpose */
  colorway?: Colorway;
}

/**
 * Use an StatusBanner for inline alerts, status, or other info a user needs to know. This component is not clickable, so it just acts as an FYI, as opposed to <StatusBannerButton>
 */
export function StatusBanner(props: StatusBannerProps) {
  const { id, colorway, closable, icon, text, closeAction } = props;

  const containerCss = [
    rcss.rowWithGap(4),
    rcss.align.center,
    rcss.p(4),
    rcss.pl(8),
    rcss.borderRadius(8),
    rcss.flex.growAndShrink(1),
    { borderWidth: 1, borderStyle: "solid" },
    colorway
      ? {
          background: colormap[colorway].dimmest,
          borderColor: colormap[colorway].dimmer,
          color: colormap[colorway].strongest,
        }
      : {
          background: "var(--interactive-background)",
          borderColor: "var(--interactive-border)",
          color: tokens.foregroundDefault,
        },
  ];

  return (
    <View id={id} css={containerCss}>
      <View css={[rcss.rowWithGap(8), rcss.center, rcss.flex.growAndShrink(1)]}>
        {icon ? React.cloneElement(icon, { size: 16 }) : null}
        <Text css={rcss.flex.growAndShrink(1)} variant={"small"} multiline>
          {text}
        </Text>
      </View>

      {closable ? (
        <Surface
          elevated
          css={[rcss.flex.grow(0), { background: "transparent" }]}
        >
          <IconButton
            alt="Close"
            tooltipHidden
            colorway={colorway}
            onClick={closeAction}
          >
            <CloseIcon />
          </IconButton>
        </Surface>
      ) : null}
    </View>
  );
}
