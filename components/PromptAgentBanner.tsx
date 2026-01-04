"use client";

import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

interface PromptAgentBannerProps {
  position?: "header" | "footer";
}

export default function PromptAgentBanner({ position = "header" }: PromptAgentBannerProps) {
  return (
    <Link
      href="https://www.sinhasys.com/promptagent"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        relative block w-full z-10
        bg-gray-900/60 backdrop-blur-sm
        border-y border-gray-800/50
        hover:bg-gray-900/70
        transition-all duration-300
        group
        ${position === "header" ? "border-b" : "border-t"}
      `}
    >
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap">
          {/* Icon */}
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 group-hover:text-orange-400 transition-colors" />
              <div className="absolute inset-0 bg-orange-500/20 blur-sm rounded-full group-hover:bg-orange-500/30 transition-colors"></div>
            </div>
          </div>

          {/* Text Content - Responsive */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-300 font-medium tracking-wide whitespace-nowrap">
              <span className="hidden sm:inline">Automate your AI prompting with </span>
              <span className="sm:hidden">AI prompt automation: </span>
            </span>
            <span className="text-[10px] xs:text-xs sm:text-sm font-bold text-orange-400 whitespace-nowrap">
              PromptAgent
            </span>
            <span className="text-xs sm:text-sm text-gray-400 font-light hidden sm:inline">
              →
            </span>
          </div>

          {/* External Link Icon */}
          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-gray-300 transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Subtle gradient accent line on hover */}
      <div className={`absolute ${position === "header" ? "bottom-0" : "top-0"} left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    </Link>
  );
}

