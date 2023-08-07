import * as React from "react";
import { View } from "./View";
import { rcss } from "./themes";
import SearchIcon from "./icons/Search";
import CloseIcon from "./icons/Close";
import { IconButton } from "./IconButton";
import LoadingIcon from "./icons/Loading";
import { Input } from "./Input";
import { PressEvent } from "@react-types/shared";
import { css } from "@emotion/react";

interface SearchBarProps {
  /** A passed ID in order to associate with a label */
  id?: string;
  /** The value */
  value?: string;
  /** The name */
  name?: string;
  /** The placeholder value */
  placeholder?: string;
  /** is the searchbar loading or processing? */
  loading?: boolean;
  /** The change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Called when input is cleared */
  onClear?: (e: PressEvent) => void;
  /** The onFocus handler */
  onFocus?: (e: React.FocusEvent<Element>) => void;
  /** The onBlur handler */
  onBlur?: (e: React.FocusEvent<Element>) => void;
  /** The keydown handler */
  onKeyDown?: (e: React.KeyboardEvent<Element>) => void;
  /** Makes the input look inactive and prevents any interaction with it */
  disabled?: boolean;
  /** Allows customizing searchbar look via `css` prop */
  className?: string;
  /** Allows setting a ref to the input element */
  inputRef?: React.Ref<HTMLInputElement>;
}

const iconPositionStyles = css([
  rcss.position.absolute,
  rcss.center,
  { top: 0, right: 0, height: "100%" },
]);

export function SearchBar(props: SearchBarProps) {
  return (
    <View css={[rcss.position.relative, rcss.flex.shrink(1)]}>
      <Input
        id={props.id}
        className={props.className}
        css={[rcss.pr(32)]}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder || "Search"}
        name={props.name}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        disabled={props.disabled}
        ref={props.inputRef}
      />
      {props.loading ? (
        <View
          css={[
            iconPositionStyles,
            rcss.p(8),
            { pointerEvents: "none" as "none" },
          ]}
        >
          <LoadingIcon />
        </View>
      ) : null}

      {!props.loading && !props.value ? (
        <View
          css={[
            iconPositionStyles,
            rcss.p(8),
            { pointerEvents: "none" as "none" },
          ]}
        >
          <SearchIcon />
        </View>
      ) : null}

      {!props.loading && props.value ? (
        <View css={[rcss.p(4), iconPositionStyles]}>
          <IconButton
            alt="Clear"
            tooltipHidden
            disabled={props.disabled}
            css={{
              "&:hover": {
                backgroundColor: "var(--background-highest) !important",
              },
            }}
            onClick={props.onClear}
          >
            <CloseIcon />
          </IconButton>
        </View>
      ) : null}
    </View>
  );
}
