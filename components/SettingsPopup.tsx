import React, {useId, useState} from "react";
import {IconButton, icons, Modal, rcss, Switch, Text, Tooltip,} from "../rui";

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
                                                             description,
                                                         }) => {
    const switchID = useId();
    return (
        <div css={[rcss.flex.row, {alignItems: "center"}]}>
            <label htmlFor={switchID}>
                <div css={[rcss.flex.column]}>
                    <div css={[rcss.flex.row, rcss.rowWithGap(4)]}>
                        {icon}
                        <Text>{title}</Text>
                        <Tooltip placement="bottom-end" tooltip={info}>
                            {(triggerProps, ref) => (
                                <span ref={ref} {...triggerProps}>
                  <icons.Info/>
                </span>
                            )}
                        </Tooltip>
                    </div>
                    <Text variant="small">{description}</Text>
                </div>
            </label>
            <Switch
                aria-labelledby={switchID}
                isSelected={state}
                onChange={() => {
                    setState(!state);
                }}
            />
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
                                                         setShouldSaveSID,
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
                    <SettingsSection
                        state={shouldSaveTheme}
                        setState={setShouldSaveTheme}
                        icon={<icons.Palette/>}
                        title="Save Theme"
                        info="When the Log In or Refresh button is pressed, your theme will be loaded from local storage and set."
                        description="Save your theme"
                    />
                    <SettingsSection
                        state={shouldSaveSID}
                        setState={setShouldSaveSID}
                        icon={<icons.CreditCard/>}
                        title="Save SID"
                        info="Upon page load, the SID input will be automatically populated with the value retrieved from local storage. This stored SID corresponds to the last successful login or refresh action."
                        description="Save your SID"
                    />
                </div>
            </Modal>
            <div css={[{position: "fixed", bottom: "20px", right: "20px"}]}>
                <IconButton
                    alt="Open Settings"
                    size={40}
                    onClick={() => setShowSettings(true)}
                >
                    <icons.Settings/>
                </IconButton>
            </div>
        </>
    );
};

export default SettingsPopup;
