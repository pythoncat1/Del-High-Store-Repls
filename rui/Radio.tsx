import * as React from "react";
import { View, SpecializedView } from "./View";
import { interactive } from "./Interactive";
import { rcss, tokens } from "./themes";
import { cssRecord } from "./cssRecord";

type RadioProps = {
  /** A passed ID in order to associate with a label */
  id: string;
  /** Allows customizing Radio's input via `css` prop */
  className?: string;
  /** Name that associates all the radio elements into one group, optionally can be provided by wrapping in a RadioGroup */
  name?: string;
  /** Value associated with this radio element */
  value: string;
  /** Disables radio, the element looks inactive and onChange can't fire, optionally can be provided by wrapping in a RadioGroup */
  disabled?: boolean;
  /** Checks the input radio element, element is considered "selected", optionally can be provided by wrapping in a RadioGroup */
  checked?: boolean;
  /** Called when the user clicks, taps or uses keyboard to activate the radio, optionally can be provided by wrapping in a RadioGroup */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type RadioGroupProps = {
  /** Tag to use as the wrapping element for the RadioGroup */
  tag?: keyof JSX.IntrinsicElements;
  /** Allows customizing RadioGroup's element via `css` prop */
  className?: string;
  /** Children, which should include Radio elements somewhere as a descendent */
  children?: React.ReactNode;
  /** Name that associates all the radio elements into one group */
  name: string;
  /** Value associated with this radio element */
  value: string;
  /** Disables all childe Radio elements */
  disabled?: boolean;
  /** Called when the user clicks, taps or uses keyboard to activate a child Radio element */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioContext = React.createContext<RadioGroupProps | null>(null);

/**
 * RadioGroup is a wrapper for Radio elements. The RadioGroup will set the name,
 * onChange, checked and disabled properties for the Radio elements.
 */
export function RadioGroup({
  name,
  value,
  disabled,
  onChange,
  children,
  tag,
  className,
}: RadioGroupProps) {
  return (
    <View tag={tag} className={className}>
      <RadioContext.Provider value={{ value, name, onChange, disabled }}>
        {children}
      </RadioContext.Provider>
    </View>
  );
}

const Input = SpecializedView.input;

const radioTokens = { bg: "--bg" };
const bgVar = `var(${radioTokens.bg})`;

const style = cssRecord({
  container: [rcss.justify.center, rcss.align.center, rcss.position.relative],
  input: [
    interactive.filledAndOutlined,
    {
      // allows for custom styling
      // https://developer.mozilla.org/en-US/docs/Web/CSS/appearance
      appearance: "none",
      width: 20,
      height: 20,
      borderRadius: "50%",
    },
  ],
  checked: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    position: "absolute",
    pointerEvents: "none",
    backgroundColor: bgVar,
  },
});

/**
 * Use a Radio for selectable inputs when selection is required.
 */
export function Radio({
  onChange,
  id,
  checked,
  disabled,
  name,
  value,
  ...props
}: RadioProps) {
  const groupContext = React.useContext(RadioContext);
  if (groupContext) {
    name = name ?? groupContext.name;
    checked = checked ?? groupContext.value === value;
    onChange = onChange ?? groupContext.onChange;
    disabled = disabled ?? groupContext.disabled;
  }

  const checkedBg = disabled
    ? tokens.outlineDefault
    : tokens.accentPrimaryDefault;

  return (
    <View
      css={style.container}
      style={{
        [radioTokens.bg]: checkedBg,
      }}
    >
      <Input
        id={id}
        name={name}
        value={value}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e)}
        css={style.input}
        {...props}
      />
      {checked ? <View css={style.checked} /> : null}
    </View>
  );
}
