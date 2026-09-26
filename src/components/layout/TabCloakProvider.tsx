"use client";

import { useEffect } from "react";

export const CLOAK_PRESETS: Record<string, { title: string; icon: string }> = {
  default: {
    title: "Clever | Portal",
    icon: "/cloaks/clever.png",
  },
  clever: {
    title: "Clever | Portal",
    icon: "/cloaks/clever.png",
  },
  classroom: {
    title: "Classes",
    icon: "https://ssl.gstatic.com/classroom/favicon.png",
  },
  docs: {
    title: "Untitled document - Google Docs",
    icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
  drive: {
    title: "My Drive - Google Drive",
    icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png",
  },
  canvas: {
    title: "Dashboard",
    icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
  },
};

export default function TabCloakProvider() {
  useEffect(() => {
    const applyCloak = () => {
      try {
        const cloakKey = localStorage.getItem("lce_tab_cloak") || "default";
        const preset = CLOAK_PRESETS[cloakKey] || CLOAK_PRESETS.default;

        document.title = preset.title;

        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "shortcut icon";
          document.head.appendChild(link);
        }
        link.href = preset.icon;
      } catch {}
    };

    applyCloak();
    window.addEventListener("lce-cloak-change", applyCloak);

    // Panic Key: Press '`' (tilde/backtick) or Escape three times to immediately redirect to Google Classroom
    let escCount = 0;
    let escTimeout: NodeJS.Timeout;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        window.location.replace("https://classroom.google.com");
      }
      if (e.key === "Escape") {
        escCount++;
        clearTimeout(escTimeout);
        if (escCount >= 3) {
          window.location.replace("https://google.com");
        }
        escTimeout = setTimeout(() => { escCount = 0; }, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("lce-cloak-change", applyCloak);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
