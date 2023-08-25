import React, { useId, useState } from "react";
import { IconButton, icons, Modal, rcss, Switch, Text, Tooltip } from "../rui";

interface SettingsSectionProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  icon: React.ReactNode;
  title: string;
  info: string;
  description: string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  state,
  setState,
  icon,
  title,
  info,
  description
}) => {
  const switchID = useId();
  return (
    <div
      css={[rcss.flex.row, { alignItems: "center", justifyContent: "space-between" }]}
    >
      <div css={[rcss.flex.row, { alignItems: "center" }]}>
        {icon}
        <div css={{ display: "flex", flexDirection: "column", marginLeft: "8px" }}>
          <div
            css={[
              rcss.flex.row,
              rcss.rowWithGap(4),
              rcss.mb(2),
              { alignItems: "center" }
            ]}
          >
            <Text css={{ marginRight: "4px" }}>{title}</Text>
            <Tooltip placement="bottom-end" tooltip={info}>
              {(triggerProps, ref) => (
                <span ref={ref} {...triggerProps}>
                  <icons.Info />
                </span>
              )}
            </Tooltip>
          </div>
          <Text variant="small">{description}</Text>
        </div>
      </div>
      <label htmlFor={switchID} css={{ marginLeft: "auto" }}>
        <Switch
          aria-labelledby={switchID}
          isSelected={state}
          onChange={() => {
            setState(!state);
          }}
        />
      </label>
    </div>
  );
};

interface SettingsPopupProps {
  setTheme: Function;
  shouldSaveTheme: boolean;
  setShouldSaveTheme: React.Dispatch<React.SetStateAction<boolean>>;
  setSID: Function;
  shouldSaveSID: boolean;
  setShouldSaveSID: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  setTheme,
  shouldSaveTheme,
  setShouldSaveTheme,
  setSID,
  shouldSaveSID,
  setShouldSaveSID
}) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);

  return (
    <>
      <Modal
        centered
        isOpen={showSettings}
        onRequestClose={() => {
          setShowSettings(false);
        }}
      >
        <div css={[rcss.flex.column, rcss.colWithGap(16)]}>
          <div css={[rcss.flex.row, rcss.rowWithGap(16), { alignItems: "center" }]}>
            <icons.Settings size={24} />
            <Text variant="headerBig" multiline={false}>
              Settings
            </Text>
          </div>
          <div css={[rcss.flex.column, rcss.colWithGap(16)]}>
            <SettingsSection
              state={shouldSaveTheme}
              setState={setShouldSaveTheme}
              icon={<icons.Palette />}
              title="Save Theme"
              info="When the Log In or Refresh button is pressed, your theme will be loaded from local storage and set."
              description="Save your theme"
            />
            <SettingsSection
              state={shouldSaveSID}
              setState={setShouldSaveSID}
              icon={<icons.CreditCard />}
              title="Save SID"
              info="Upon page load, the SID input will be automatically populated with the value retrieved from local storage. This stored SID corresponds to the last successful login or refresh action."
              description="Save your SID"
            />
          </div>
        </div>
      </Modal>
      <div css={{ position: "fixed", bottom: "20px", right: "20px" }}>
        <IconButton alt="Open Settings" size={40} onClick={() => setShowSettings(true)}>
          <icons.Settings />
        </IconButton>
      </div>
    </>
  );
};

export default SettingsPopup;
