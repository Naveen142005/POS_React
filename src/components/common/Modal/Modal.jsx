import { useEffect } from "react";

const iconToneClasses = {
  confirm: "bg-[#e7f8ec] text-[#07952b]",
  success: "bg-[#e7f8ec] text-[#07952b]",
  danger: "bg-[#ffe5e7] text-[#e01822]",
};

const iconSymbolClasses = {
  success:
    "relative block w-7 h-7 before:content-[''] before:absolute before:top-[3px] before:left-[7px] before:w-[11px] before:h-5 before:border-r-[3px] before:border-b-[3px] before:border-current before:rotate-45",
  confirm:
    "relative block w-7 h-7 before:content-[''] before:absolute before:inset-1 before:border-[3px] before:border-current before:rounded-full after:content-[''] after:absolute after:top-2 after:left-[13px] after:w-[3px] after:h-[9px] after:rounded-[2px] after:bg-current after:shadow-[0_13px_0_-0.5px_currentColor]",
  danger:
    "relative block w-7 h-7 before:content-[''] before:absolute before:top-[5px] before:left-3 before:w-[3px] before:h-[19px] before:rounded-[2px] before:bg-current before:rotate-45 after:content-[''] after:absolute after:top-[5px] after:left-3 after:w-[3px] after:h-[19px] after:rounded-[2px] after:bg-current after:-rotate-45",
};

const buttonToneClasses = {
  secondary: "border-[#5b36ff] bg-white text-[#151982]",
  confirm: "bg-[#07952b] text-white",
  success: "bg-[#07952b] text-white",
  danger: "bg-[#e01822] text-white",
};

const getVariant = (variant) =>
  Object.prototype.hasOwnProperty.call(iconToneClasses, variant)
    ? variant
    : "confirm";

const getButtonVariant = (variant) =>
  Object.prototype.hasOwnProperty.call(buttonToneClasses, variant)
    ? variant
    : "confirm";

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

  const resolvedVariant = getVariant(variant);
  const primaryVariant = getButtonVariant(primaryAction?.variant || variant);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  const buttonClassName =
    "inline-flex min-w-[150px] min-h-12 items-center justify-center gap-2 rounded-md border border-transparent px-[18px] py-2.5 font-[inherit] text-sm font-bold cursor-pointer max-[520px]:w-full";

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-[rgb(7_16_38_/_65%)] p-5"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="w-[min(100%,450px)] rounded-lg bg-white px-9 pt-[38px] pb-[30px] text-center font-['Inter',sans-serif] text-[#101633] shadow-[0_18px_55px_rgb(0_0_0_/_22%)] box-border animate-common-modal-enter motion-reduce:animate-none [&_*]:box-border max-[520px]:px-5 max-[520px]:pt-[30px] max-[520px]:pb-[22px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="common-modal-title"
        aria-describedby={message ? "common-modal-message" : undefined}
      >
        <div
          className={`mx-auto mb-[22px] grid h-[74px] w-[74px] place-items-center rounded-full ${iconToneClasses[resolvedVariant]}`}
          aria-hidden="true"
        >
          {iconSrc ? (
            <img
              className="h-[34px] w-[34px] object-contain"
              src={iconSrc}
              alt={iconAlt}
            />
          ) : (
            <span className={iconSymbolClasses[resolvedVariant]} />
          )}
        </div>

        <h2 id="common-modal-title" className="m-0 mb-2.5 text-[21px] leading-[1.3]">
          {title}
        </h2>
        {message && (
          <p
            id="common-modal-message"
            className="mx-auto my-0 max-w-[350px] text-sm leading-[1.55] text-[#455486]"
          >
            {message}
          </p>
        )}

        <div className="mt-[26px] mb-[22px] h-px bg-[#e5e8f2]" />

        <div className="flex justify-center gap-[18px] max-[520px]:flex-col-reverse max-[520px]:gap-2.5">
          {secondaryAction && (
            <button
              type="button"
              className={`${buttonClassName} ${buttonToneClasses.secondary}`}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.iconSrc && (
                <img
                  className="h-[17px] w-[17px] object-contain"
                  src={secondaryAction.iconSrc}
                  alt=""
                />
              )}
              {secondaryAction.label}
            </button>
          )}

          {primaryAction && (
            <button
              type="button"
              className={`${buttonClassName} ${buttonToneClasses[primaryVariant]}`}
              onClick={primaryAction.onClick}
            >
              {primaryAction.iconSrc && (
                <img
                  className="h-[17px] w-[17px] object-contain brightness-0 invert"
                  src={primaryAction.iconSrc}
                  alt=""
                />
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
