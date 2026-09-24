import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-1 font-sans text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:mr-3 file:inline-flex file:h-7 file:cursor-pointer file:items-center file:rounded-full file:border-0 file:bg-primary file:px-3.5 file:font-sans file:text-[0.82rem] file:font-semibold file:text-primary-foreground file:transition-colors hover:file:bg-laurel-deep placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "[&[type=file]]:h-auto [&[type=file]]:cursor-pointer [&[type=file]]:border-dashed [&[type=file]]:bg-secondary/40 [&[type=file]]:py-1.5 [&[type=file]]:text-sm [&[type=file]]:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
