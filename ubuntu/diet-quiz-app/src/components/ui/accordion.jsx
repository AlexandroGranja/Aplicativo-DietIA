// src/components/ui/accordion.jsx

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}) {
  // Não precisa de classes aqui, o Radix Root é apenas o container lógico
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      // Bordas mais sutis, fundo levemente diferente, arredondamento e sombra sutil
      className={cn(
        "border-b border-gray-200 dark:border-gray-700 last:border-b-0", // Bordas para separar itens
        "bg-white dark:bg-gray-800", // Fundo do item
        "rounded-lg", // Bordas arredondadas para um visual moderno
        "shadow-sm", // Sombra sutil para profundidade
        "mb-2", // Espaçamento entre os itens (opcional, experimente com e sem)
        className
      )}
      {...props} />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-lg py-4 text-left font-semibold transition-all outline-none", // Removi text-sm, usei font-semibold
          "hover:bg-gray-50 dark:hover:bg-gray-700", // Fundo leve no hover
          "text-gray-900 dark:text-gray-50", // Cor de texto principal
          "focus-visible:ring-[3px]", // Mantém o anel de foco
          "disabled:pointer-events-none disabled:opacity-50",
          "[&[data-state=open]>svg]:rotate-180 [&[data-state=open]]:bg-gray-100 dark:[&[data-state=open]]:bg-gray-700", // Fundo um pouco mais escuro quando aberto
          className
        )}
        {...props}>
        {children}
        <ChevronDownIcon
          // Ícone em cor secundária/muted para profissionalismo
          className="size-5 shrink-0 transition-transform duration-200 text-gray-500 dark:text-gray-400" /> {/* Aumentei o size do ícone */}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}>
      {/* Padding interno para o conteúdo */}
      <div className={cn("pb-4 pt-0 text-gray-700 dark:text-gray-300", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }