import {Modal, Switch} from "../rui";
import {React} from "react";

const SettingsPopup = (setTheme) => {
    const [showModal, setShowModal] = React.useState<boolean>(false);
    return <>
        <Modal
            centered
            isOpen={showModal}
            onRequestClose={() => {
                setShowModal(false)
            }}
        >
            <Switch/>
        </Modal>
    </>
}

const SettingsButton = (setTheme) => {
    return
}

export default SettingsPopup;