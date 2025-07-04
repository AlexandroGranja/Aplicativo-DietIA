"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

// Correção: O caminho para 'utils' foi alterado para ser relativo
// para garantir que o ficheiro é encontrado no seu ambiente.
import { cn } from "../../lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props} />
  );
}

export { Separator }
