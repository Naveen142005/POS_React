import { useEffect } from "react";
import "./modal.css";

const Modal = ({
  open,
  variant = "confirm",
  iconSrc = "",
  iconAlt = "",
  title,
  message,
  primaryAction,
  secondaryAction,
  onClose,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  return (
    <div className="common-modal-overlay" onMouseDown={handleOverlayClick}>
      <section
        className={`common-modal common-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="common-modal-title"
        aria-describedby={message ? "common-modal-message" : undefined}
      >
        <div className="common-modal__icon" aria-hidden="true">
          {iconSrc ? <img src={iconSrc} alt={iconAlt} /> : <span />}
        </div>

        <h2 id="common-modal-title">{title}</h2>
        {message && <p id="common-modal-message">{message}</p>}

        <div className="common-modal__divider" />

        <div className="common-modal__actions">
          {secondaryAction && (
            <button
              type="button"
              className="common-modal__button common-modal__button--secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.iconSrc && (
                <img src={secondaryAction.iconSrc} alt="" />
              )}
              {secondaryAction.label}
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              className={`common-modal__button common-modal__button--${
                primaryAction.variant || variant
              }`}
              onClick={primaryAction.onClick}
            >
              {primaryAction.iconSrc && (
                <img src={primaryAction.iconSrc} alt="" />
              )}
              {primaryAction.label}
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Modal;
