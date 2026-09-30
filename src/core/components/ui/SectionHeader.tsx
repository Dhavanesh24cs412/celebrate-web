import * as React from "react"
import { cn } from "../../lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12",
        {
          "items-start text-left": align === "left",
          "items-center text-center": align === "center",
          "items-end text-right": align === "right",
        },
        className
      )}
      {...props}
    >
      <h2 className="text-4xl md:text-5xl font-display text-celebrate-navy leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-celebrate-navy/80 max-w-2xl font-sans">
          {subtitle}
        </p>
      )}
    </div>
  )
}
