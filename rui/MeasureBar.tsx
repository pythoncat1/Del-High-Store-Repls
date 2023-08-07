import * as React from "react";
import { css, keyframes } from "@emotion/react";
import { rcss, tokens } from "./themes";
import { interactive } from "./Interactive";
import { View } from "./View";
// eslint-disable-next-line import/no-restricted-paths
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { Tooltip } from "./Tooltip";

export interface MeasureBarProps {
  /** Sets the total number */
  total: number;
  /** current number; if not passed, bar is empty */
  current?: number;
  /** color of the bar */
  color?: string;
  /** if the measure is disabled; this just makes the bar grey */
  disabled?: boolean;
  /** for css prop overrides */
  className?: string;
  /** if it should shake */
  shake?: boolean;
  /** if there shall be smoke */
  smoke?: boolean;
  /** for overriding the tooltip text */
  tooltip?: string;
}

const shakeAnim = keyframes(`
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -1px) rotate(-1deg); }
  20% { transform: translate(-1px, 0px) rotate(1deg); }
  30% { transform: translate(1px, 1px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 1px) rotate(-1deg); }
  60% { transform: translate(-1px, 1px) rotate(0deg); }
  70% { transform: translate(1px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 1px) rotate(0deg); }
  100% { transform: translate(1px, -1px) rotate(-1deg); }`);

const measureBarCss = {
  root: css([
    rcss.flex.growAndShrink(1),
    rcss.height(tokens.space12),
    rcss.borderRadius(16),
    interactive.filledAndOutlined,
    rcss.overflow("clip"),
  ]),
  animation: css({
    animation: `${shakeAnim} 0.2s ease infinite`,
  }),
  bar: css([
    {
      height: "100%",
      borderRadius: tokens.borderRadiusRound,
    },
  ]),
  image: css({
    height: "500%",
    width: "150%",
    position: "absolute",
    left: "50%",
    top: "100%",
    transition: "1s opacity",
    transform: "translate(-50%, -100%)",
  }),
};

/**
 * Use a MeasureBar to display a lil bar graph of some numeric data
 */
export function MeasureBar({
  total,
  current,
  disabled = false,
  color = tokens.accentPrimaryDefault,
  className,
  shake,
  smoke,
  tooltip,
}: MeasureBarProps) {
  const valueMeasured = tooltip
    ? tooltip
    : (current !== undefined ? current : "0") + "/" + total;

  let definedCurrent = 0;
  if (current !== undefined) {
    definedCurrent = current;
  }

  const widthPercent =
    total !== 0
      ? Math.max(0, Math.min(100, Math.floor((definedCurrent / total) * 100)))
      : 0;

  const allowAnimation = !usePrefersReducedMotion();

  return (
    <Tooltip tooltip={valueMeasured} placement="top">
      {
        /*@ts-ignore*/
        (triggerProps, ref: (instance: HTMLElement | null) => void) => (
          <View
            {...triggerProps}
            innerRef={ref}
            css={[
              measureBarCss.root,
              allowAnimation && shake && measureBarCss.animation,
            ]}
            className={className}
          >
            {current !== undefined && (
              <View
                style={{
                  width: widthPercent + "%",
                  backgroundColor: disabled ? tokens.outlineDefault : color,
                }}
                css={measureBarCss.bar}
              />
            )}
            {allowAnimation && smoke ? (
              <img
                style={{ opacity: smoke ? 0.4 : 0 }}
                src="/public/images/smoke.gif"
                alt=""
                css={measureBarCss.image}
              />
            ) : null}
          </View>
        )
      }
    </Tooltip>
  );
}
