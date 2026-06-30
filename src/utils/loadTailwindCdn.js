const loadTailwindCdn = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("tailwind-cdn")) return;

  const existingConfig = window.tailwind?.config || {};
  const existingTheme = existingConfig.theme || {};
  const existingExtend = existingTheme.extend || {};

  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    ...existingConfig,
    theme: {
      ...existingTheme,
      extend: {
        ...existingExtend,
        keyframes: {
          ...existingExtend.keyframes,
          "common-modal-enter": {
            from: {
              opacity: "0",
              transform: "translateY(12px) scale(0.98)",
            },
            to: {
              opacity: "1",
              transform: "translateY(0) scale(1)",
            },
          },
        },
        animation: {
          ...existingExtend.animation,
          "common-modal-enter": "common-modal-enter 180ms ease-out",
        },
      },
    },
  };

  const script = document.createElement("script");
  script.id = "tailwind-cdn";
  script.src = "https://cdn.tailwindcss.com";
  script.async = true;
  document.head.appendChild(script);
};

export default loadTailwindCdn;
