import { Modal, Switch, IconButton, icons, rcss, Tooltip, Text } from "../rui";
import React, {useState, useId} from "react";
// @ts-ignore
const SettingsSection = (state, setState, icon, title, info, description) => {
  const switchID = useId();
  return (
    <div css={[rcss.flex.row, rcss.mb(16), { alignItems: "center" }]}>
      <label htmlFor={switchID}>
        <div css={[rcss.flex.column]}>
          <div css={[rcss.flex.row, rcss.rowWithGap(4)]}>
            {icon}
            <Text>{title}</Text>
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
      </label>
        <Switch
          id={switchID}
          isSelected={state}
          onChange={() => {
            setState(!state);
          }}
/>
    </div>
  );
};
// @ts-ignore
const SettingsPopup = (
  setTheme, shouldSaveTheme, setShouldSaveTheme, // Theme Saving
  setSID, shouldSaveSID, setShouldSaveSID // SID Saving
) => {
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
        <div css={[rcss.flex.row]}> { /* Possibly split settings into dropdowns. This section would be localStorage options, using the Disk icon */}
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
          />
        </div> {/* Add buttons to clear SID and Theme? */}
      </Modal>
      <div css={[{ position: "fixed", bottom: "20px", right: "20px" }]}>
        <IconButton alt="Open Settings" size={40} onClick={() => setShowSettings(true)}>
          <icons.Settings />
        </IconButton>
      </div>
    </>
  );
};

export default SettingsPopup;