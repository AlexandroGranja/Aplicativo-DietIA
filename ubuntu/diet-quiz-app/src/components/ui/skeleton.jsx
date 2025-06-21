// Correção: O caminho para 'utils' foi alterado para ser relativo
// para garantir que o ficheiro é encontrado no seu ambiente.
import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
