import * as React from "react";
import { View, SpecializedView } from "./View";
import { Text } from "./Text";
import { rcss, tokens } from "./themes";
import { interactiveVars } from "./Interactive";
import { Props as IconProps } from "./icons/Icon";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useFocusRing } from "@react-aria/focus";

export interface ButtonGroupItemProps {
  /** A passed ID in order to associate with a label */
  id: string;
  /** Allows customizing ButtonGroupItem's input via `css` prop */
  className?: string;
  /** Name that associates all the ButtonGroupItems into one group, optionally can be provided by wrapping in a ButtonGroup */
  name?: string;
  /** Value associated with this ButtonGroupItem */
  // TODO use generics for values
  value: any;
  /** Value displayed on this ButtonGroupItem */
  text: string;
  /** Icon on the left side of the button */
  icon?: React.ReactElement<IconProps>;
  /** Makes the color of this ButtonGroupItem primary when selected */
  primary?: boolean;
  /** Disables ButtonGroupItem, the element looks inactive and onChange can't fire, optionally can be provided by wrapping in a ButtonGroup */
  disabled?: boolean;
  /** Selects the input ButtonGroupItem element, element is considered "checked", optionally can be provided by wrapping in a ButtonGroup */
  checked?: boolean;
  /** Called when the user clicks, taps or uses keyboard to activate the ButtonGroupItem, optionally can be provided by wrapping in a ButtonGroup */
  // TODO use generics and infer the value
  onChange?: (value: any) => void;
  /** cypress handle */
  dataCy?: string;
}

export interface ButtonGroupProps {
  /** Tag to use as the wrapping element for the ButtonGroup */
  tag?: keyof JSX.IntrinsicElements;
  /** Allows customizing ButtonGroup's element via `css` prop */
  className?: string;
  /** Children, which should include ButtonGroupItems somewhere as a descendent */
  children?: React.ReactNode;
  /** Name that associates all the ButtonGroupItems into one group */
  name: string;
  /** Value associated with this ButtonGroupItem */
  // TODO use generics for values
  value: any;
  /** Makes the ButtonGroup layout a row */
  row?: boolean;
  /** Makes the ButtonGroup stretch to fill its container. Use for row ButtonGroups only. */
  stretch?: boolean;
  /** Makes the color of the selected ButtonGroupItem primary */
  primary?: boolean;
  /** Disables all child ButtonGroupItems */
  disabled?: boolean;
  /** Called when the user clicks, taps or uses keyboard to activate a child ButtonGroupItem */
  // TODO use generics and infer the value
  onChange?: (value: any) => void;

  /** the cypress handle to the underlying form element */
  dataCy?: string;

  id?: string;
}

const ButtonGroupContext = React.createContext<ButtonGroupProps | null>(null);

/**
 * ButtonGroup is a wrapper for ButtonGroupItems. The ButtonGroup will set the name,
 * onChange, checked and disabled properties for the ButtonGroupItems.
 */
export function ButtonGroup({
  name,
  value,
  row,
  stretch,
  disabled,
  onChange,
  children,
  primary,
  tag = "fieldset",
  dataCy,
  ...props
}: ButtonGroupProps) {
  return (
    <View
      tag={tag}
      {...props}
      data-cy={dataCy}
      css={[
        rcss.borderRadius(8),
        {
          backgroundColor: interactiveVars.interactiveBackground,
        },
        row && {
          display: "flex",
          flexDirection: "row" as "row",
          width: stretch ? "100%" : "min-content",
        },
        row && stretch && { justifyItems: "stretch" },
      ]}
    >
      <ButtonGroupContext.Provider
        value={{ value, name, onChange, primary, disabled }}
      >
        {children}
      </ButtonGroupContext.Provider>
    </View>
  );
}

const Input = SpecializedView.input;

interface ButtonGroupItemCssOptions {
  checked?: boolean;
  disabled?: boolean;
  isFocusVisible?: boolean;
  primary?: boolean;
}

export function buttonGroupItemCss({
  checked,
  disabled,
  isFocusVisible,
  primary,
}: ButtonGroupItemCssOptions) {
  return [
    rcss.height(32),
    rcss.display.flex,
    rcss.rowWithGap(8),
    rcss.justify.center,
    rcss.align.center,
    rcss.p(8),
    rcss.borderRadius(8),
    { flex: 1 },
    checked &&
      !disabled &&
      primary &&
      rcss.backgroundColor("accentPrimaryDimmer"),
    checked &&
      (!primary || (disabled && primary)) && {
        backgroundColor: interactiveVars.interactiveBackgroundActive,
        transition: "background-color 120ms ease",
      },
    {
      "> span": {
        transition: "color 120ms ease-out",
      },
      "> svg": {
        transition: "stroke 120ms ease-out",
      },
    },
    !checked &&
      !disabled && {
        ":hover span": {
          color: tokens.foregroundDefault,
        },
        ":hover svg": {
          fill: tokens.foregroundDefault,
        },
      },
    !disabled && {
      cursor: "pointer",
    },
    isFocusVisible && {
      outline: "2px solid " + tokens.accentPrimaryDefault,
    },
  ];
}

/**
 * Use a ButtonGroupItem for selectable inputs when selection is required.
 */
export function ButtonGroupItem({
  onChange,
  id,
  checked,
  disabled,
  name,
  value,
  text,
  icon,
  primary,
  dataCy,
  ...props
}: ButtonGroupItemProps) {
  const groupContext = React.useContext(ButtonGroupContext);
  if (groupContext) {
    name = name ?? groupContext.name;
    checked = checked ?? groupContext.value === value;
    onChange = onChange ?? groupContext.onChange;
    disabled = disabled ?? groupContext.disabled;
    primary = primary ?? groupContext.primary;
  }

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <label
      css={buttonGroupItemCss({
        checked,
        disabled,
        isFocusVisible,
        primary,
      })}
      data-cy={dataCy}
    >
      <VisuallyHidden>
        <Input
          {...focusProps}
          id={id}
          name={name}
          value={value}
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={() => onChange?.(value)}
          {...props}
        />
      </VisuallyHidden>
      {icon
        ? React.cloneElement(icon, {
            size: 16,
            color:
              checked && !disabled
                ? tokens.foregroundDefault
                : tokens.foregroundDimmer,
          })
        : null}
      <Text color={checked && !disabled ? "default" : "dimmer"}>{text}</Text>
    </label>
  );
}
