import * as React from "react";
import { rcss } from "./themes";
import { View } from "./View";
import { interactive } from "./Interactive";
import ChevronUpIcon from "./icons/ChevronUp";
import { screenMediaForMaxWidth } from "./lib/media";
import { useUID } from "react-uid";
import { useControlledState } from "@react-stately/utils";
import { Interpolation, Theme } from "@emotion/react";
export interface AccordionItemProps {
  /** for css prop overrides */
  className?: string;
  /** what to put in the accordion item */
  children: React.ReactNode;
  /** what content should be placed in the header of the AccordionItem */
  headerContent:
    | string
    | React.ReactNode
    | (({
        isExpanded,
        toggle,
        toggleAttributes,
      }: {
        isExpanded?: boolean;
        toggle?: () => void;
        toggleAttributes?: ReturnType<ToggleAttributesType>;
      }) => React.ReactNode);
  /** is the accordion item expanded */
  expanded?: boolean;
  /** is the accordion item expanded by default */
  defaultExpanded?: boolean;
  /** What's the unique ID for the AccordionItem? For ARIA, if you use more than one in a section, you should pass increasing index numbers here */
  uuid?: number;
  /** Variant. Controls expander button padding and chevron icon size */
  variant?: "default" | "large";
  /** Chevron display options */
  chevron?: "start" | "end" | "none";
  /** Toggle on click options */
  toggleOn?: "header" | "chevron";
  /** OnClick. Useful for analytics and tracking, or controlling expanded state from parent */
  onClick?: () => void;
  /** Slight border radius or not for the accordion item or not. By default there is the border radius. */
  round?: boolean;
  /** is the chevron animated when toggling (default true) */
  animateChevron?: boolean;
}

const getToggleAttributes = ({
  uuid,
  isExpanded,
}: {
  uuid: string;
  isExpanded: boolean;
}) => ({
  role: "button",
  tag: "button" as React.ElementType,
  ["aria-expanded"]: isExpanded,
  id: `${"AccordionControl" + uuid}`,
  ["aria-controls"]: `${"AccordionContent" + uuid}`,
  type: "button",
});

type ToggleAttributesType = typeof getToggleAttributes;

const AccordionToggle: React.FC<{
  toggleOn: boolean;
  uuid: string;
  onClick: () => void;
  isExpanded: boolean;
  children: React.ReactNode;
  css?: Interpolation<Theme>;
}> = ({ toggleOn, uuid, onClick, isExpanded, children, ...rest }) => {
  const toggleAttributes = React.useMemo(
    () =>
      getToggleAttributes({
        uuid,
        isExpanded,
      }),
    [uuid, isExpanded]
  );

  return (
    <View
      {...(toggleOn
        ? {
            css: [rcss.reset.button, interactive.listItem],
            onClick,
            ...toggleAttributes,
            ...rest,
          }
        : rest)}
    >
      {children}
    </View>
  );
};

const noop = () => {};

export interface UseDisclosureProps {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onChange?: () => void;
}

/**
 * handles state for a controlled/uncontrolled disclosure component.
 * based on @react-stately/toggle
 *
 * https://github.com/adobe/react-spectrum/blob/38a57d3360268fb0cb55c6b42b9a5f6f13bb57d6/packages/%40react-stately/toggle/src/useToggleState.ts#L30-L54
 * */
export const useDisclosureState = ({
  defaultExpanded = false,
  expanded,
  onChange = noop,
}: UseDisclosureProps) => {
  // allow this component to be controlled or uncontrolled
  const [isExpanded = false, setExpanded] = useControlledState(
    expanded,
    defaultExpanded,
    onChange
  );

  const toggle = React.useCallback(() => {
    setExpanded(!isExpanded);
  }, [isExpanded, setExpanded]);

  return {
    isExpanded,
    toggle,
  };
};

/**
 * Use an AccordionItem for foldable content.
 * This item is ARIA-compatible: https://www.w3.org/TR/wai-aria-practices-1.1/#accordion
 */
export function AccordionItem({
  className,
  children,
  headerContent,
  expanded,
  defaultExpanded = false,
  variant = "default",
  chevron = "end",
  toggleOn = "header",
  onClick = noop,
  round = true,
  animateChevron = true,
}: AccordionItemProps) {
  const uuid = useUID();

  const { isExpanded, toggle } = useDisclosureState({
    defaultExpanded,
    expanded,
    onChange: onClick,
  });

  const iconSize = variant === "large" ? 24 : undefined;

  const padding =
    variant === "large"
      ? [
          rcss.py(16),
          rcss.px(24),
          { [screenMediaForMaxWidth("mobileMax")]: [rcss.p(16)] },
        ]
      : [rcss.p(4)];

  const toggleAttributes = React.useMemo(
    () =>
      getToggleAttributes({
        uuid,
        isExpanded,
      }),
    [uuid, isExpanded]
  );

  return (
    <View css={[rcss.flex.column]} className={className}>
      <AccordionToggle
        css={[
          rcss.display.flex,
          rcss.flex.row,
          rcss.justify.spaceBetween,
          rcss.align.stretch,
          padding,
          [round ? [rcss.borderRadius(4)] : [rcss.borderRadius(0)]],
        ]}
        toggleOn={toggleOn === "header"}
        uuid={uuid}
        onClick={toggle}
        isExpanded={isExpanded}
      >
        {chevron === "start" && (
          <AccordionToggle
            css={[rcss.px(4), rcss.justify.center]}
            toggleOn={toggleOn === "chevron"}
            uuid={uuid}
            onClick={toggle}
            isExpanded={isExpanded}
          >
            <ChevronUpIcon
              size={iconSize}
              rotate={isExpanded ? 0 : 180}
              css={[animateChevron && rcss.transition.snappy]}
            />
          </AccordionToggle>
        )}

        {typeof headerContent === "function"
          ? headerContent({
              isExpanded,
              toggle,
              toggleAttributes,
            })
          : headerContent}

        {chevron === "end" && (
          <AccordionToggle
            css={[rcss.px(4), rcss.justify.center]}
            toggleOn={toggleOn === "chevron"}
            uuid={uuid}
            onClick={toggle}
            isExpanded={isExpanded}
          >
            <ChevronUpIcon
              size={iconSize}
              rotate={isExpanded ? 0 : 180}
              css={[animateChevron && rcss.transition.snappy]}
            />
          </AccordionToggle>
        )}
      </AccordionToggle>
      {isExpanded ? (
        <View
          aria-labelledby={"AccordionControl" + uuid}
          id={"AccordionContent" + uuid}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}
