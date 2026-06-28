const loadTailwindCdn = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("tailwind-cdn")) return;

  const script = document.createElement("script");
  script.id = "tailwind-cdn";
  script.src = "https://cdn.tailwindcss.com";
  script.async = true;
  document.head.appendChild(script);
};

export default loadTailwindCdn;
