import {
  Overlay,
  useModalOverlay,
  useOverlayFocusContain,
} from "@react-aria/overlays";
import { useDialog } from "@react-aria/dialog";
import { useIsSSR } from "@react-aria/ssr";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { cssRecord } from "./cssRecord";
import CloseIcon from "./icons/Close";
import { isMobile } from "is-mobile";
import * as React from "react";
import { UIDReset } from "react-uid";
import { IconButton } from "./IconButton";
import type { Background } from "./Surface";
import { Surface } from "./Surface";
import { ModalZIndex, tokens } from "./themes";

export interface ModalProps {
  /** Whenever the modal is shown */
  isOpen: boolean;
  /** Maximum width of the modal, including content padding. Default is 512, use 872 for bigger modals. */
  maxWidth?: number | string;
  /** Makes this impossible to close */
  preventClose?: boolean;
  /** Prevents closing the modal by clicking outside its surface. Useful for
   * modals that are not user-triggered or might be delayed, and that users
   * might otherwise close involuntary. */
  preventOutsideModalClickClose?: boolean;
  /** Called when the user clicks X button or taps overlay */
  onRequestClose: () => void;
  /** Hides the X button */
  hideCloseButton?: boolean;
  /** Should the Modal be vertically centered? */
  centered?: boolean;
  /** Anything that goes in the modal */
  children: React.ReactNode;
  /** optional elevation prop: 'root', 'default', 'higher', 'highest' */
  elevation?: Background;
  /** optional prop for no padding around contents */
  noPadding?: boolean;
  /** Use this to override styles for the content wrapper */
  className?: string;
  /** Modal wrapper will shrink to hug the content's size. This is still impacted by maxWidth */
  fitContent?: boolean;
  /** Is the modal being opened from the side of the screen? */
  fromSide?: boolean;
}

const TRANSITION_DURATION = 100;

const css = cssRecord({
  underlay: [
    {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: "auto",
      zIndex: ModalZIndex,
      display: "block",
      backgroundColor: tokens.backgroundOverlay,
      transition: `opacity ${TRANSITION_DURATION}ms`,
      opacity: 0,
      padding: tokens.space16,
      [`@media screen and (min-width: 512px)`]: {
        padding: tokens.space32,
        paddingTop: tokens.space64,
        paddingBottom: tokens.space64,
      },
    },
  ],
  dialogFromSide: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "auto",
    height: "100%",
  },
  dialogPopUp: {
    flexGrow: 1,
    flexShrink: 1,
    outline: "none",
    position: "relative",
    boxShadow: tokens.shadow2,
    borderRadius: tokens.borderRadius8,
    border: "1px solid var(--background-highest)",
  },
  modalContentFromSide: {
    borderRadius: 0,
    height: "100%",
    borderLeft: `solid 1px ${tokens.backgroundHigher}`,
  },
  modalContentPopUp: {
    borderRadius: tokens.borderRadius8,
    height: "auto",
    borderLeft: "none",
  },
  closeButton: {
    position: "absolute",
    top: tokens.space16,
    right: tokens.space16,
    zIndex: ModalZIndex + 1, // so it's on top of the content
  },
});

/**
 * Use Modal when there's an information or an action needs to go over a large
 * part of a page. Can be closed.
 */
export function Modal({
  children,
  maxWidth = 512,
  centered: centeredParam = false,
  noPadding = false,
  elevation = "default",
  className,
  fitContent = false,
  fromSide = false,
  ...props
}: ModalProps) {
  // TODO: bug in react-aria causes a nextjs error Unhandled Runtime Error
  // TypeError: Cannot read properties of null (reading 'contains')
  // use a proper ref here once a bug fix is available, in the meantime use a callback ref
  // https://github.com/adobe/react-spectrum/issues/3787#issuecomment-1413900016
  const [modalOverlayRef, setRef] = React.useState<HTMLDivElement | null>(null);

  const state = useOverlayTriggerState({
    isOpen: props.isOpen,
    onOpenChange: (o) => {
      if (!o) {
        props.onRequestClose();
      }
    },
  });
  const { modalProps, underlayProps } = useModalOverlay(
    {
      isDismissable: !props.preventClose,
      isKeyboardDismissDisabled: props.preventOutsideModalClickClose,
    },
    state,
    { current: modalOverlayRef }
  );
  // helper state to control the modal's fade in via `opacity`.
  // to get a fade-in effect, we need to set opacity from 0 to 1
  // after the modal is opened, and from 1 to 0 once the modal is told to close.
  const [transitionState, setTransitionState] = React.useState<
    "afterOpen" | "beforeClose" | null
  >(null);
  // We haven't found a reliable way to measure the height of the mobile
  // "soft" keyboard on Android. Without that measurement, we can't safely
  // center modals above the keyboard.
  const canCenter = !isMobile({ tablet: true });
  const centered = React.useMemo(() => {
    return centeredParam && canCenter;
  }, [centeredParam, canCenter]);
  const isSSR = useIsSSR();

  React.useEffect(() => {
    if (state.isOpen) {
      if (!transitionState) {
        setTimeout(() => {
          setTransitionState("afterOpen");
        }, 0);
      }
    } else if (transitionState === "afterOpen") {
      setTransitionState("beforeClose");
      setTimeout(() => {
        setTransitionState(null);
      }, TRANSITION_DURATION);
    }
  }, [state.isOpen, transitionState]);

  if (isSSR) {
    return null;
  }

  if (!state.isOpen && !transitionState) {
    return null;
  }

  return (
    <UIDReset prefix="modal">
      <Overlay portalContainer={document.body}>
        <div
          {...underlayProps}
          css={css.underlay}
          style={{
            display: centered ? "flex" : "block",
            opacity: transitionState === "afterOpen" ? 1 : 0,
          }}
        >
          <div
            ref={setRef}
            {...modalProps}
            css={fromSide ? css.dialogFromSide : css.dialogPopUp}
            style={
              !fromSide
                ? {
                    width: fitContent ? "fit-content" : "100%",
                    maxWidth,
                    margin: centered ? "auto" : "0 auto",
                  }
                : undefined
            }
            className={className}
          >
            <Dialog
              elevation={elevation}
              fromSide={fromSide}
              preventClose={props.preventClose}
              hideCloseButton={props.hideCloseButton}
              onRequestClose={props.onRequestClose}
              noPadding={noPadding}
            >
              {children}
            </Dialog>
          </div>
        </div>
      </Overlay>
    </UIDReset>
  );
}

/**
 * The inner content of the modal.
 */
const Dialog = ({
  elevation,
  fromSide,
  preventClose,
  hideCloseButton,
  onRequestClose,
  noPadding,
  children,
}: Pick<
  ModalProps,
  | "elevation"
  | "fromSide"
  | "preventClose"
  | "hideCloseButton"
  | "onRequestClose"
  | "noPadding"
  | "children"
>) => {
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  const { dialogProps } = useDialog(
    {
      "aria-label": "Dialog",
    },
    modalContentRef
  );

  // TODO: dialog doesn't want to contain focus unless we invoke `useOverlayFocusContain` manually. reference:
  // https://github.com/adobe/react-spectrum/blob/0fbd9c75b2b3c3705451c9bbfa0360618ead5095/packages/@react-aria/dialog/src/useDialog.ts#L62
  useOverlayFocusContain();

  return (
    <Surface
      innerRef={modalContentRef}
      background={elevation}
      css={fromSide ? css.modalContentFromSide : css.modalContentPopUp}
      style={{
        padding: noPadding ? 0 : tokens.space16,
      }}
      {...dialogProps}
    >
      {/* Close button is before children so focus goes to it first*/}
      {preventClose || hideCloseButton ? null : (
        <IconButton
          alt="Close"
          dataCy="close-modal"
          tooltipHidden
          css={css.closeButton}
          onClick={() => {
            onRequestClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {children}
    </Surface>
  );
};
