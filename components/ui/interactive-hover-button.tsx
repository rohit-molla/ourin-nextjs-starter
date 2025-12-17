import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        // Light mode: black bg, white text → hover: white bg, black text (via dot expansion)
        // Dark mode: white bg, black text → hover: black bg, white text (via dot expansion)
        "bg-black dark:bg-white text-white dark:text-black",
        "border-white/20 dark:border-black/20",
        "transition-colors duration-300",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {/* Dot that expands - inverted color from bg */}
        <div className="bg-white dark:bg-black h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
        {/* Original text - slides out */}
        <span className="inline-block text-white dark:text-black transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      {/* Hover text - slides in with arrow, inverted colors */}
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span className="text-black dark:text-white">{children}</span>
        <ArrowRight className="text-black dark:text-white" />
      </div>
    </button>
  )
}
