import { User, Target, Activity, Apple, LifeBuoy } from 'lucide-react';
import { cn } from "@/lib/utils";

export const Sidebar = ({ t, currentStep }) => {
  const menuItems = [
    { label: t.personalInfo, icon: User, step: 1 },
    { label: t.objectives, icon: Target, step: 2 },
    { label: t.dailyRoutine, icon: Activity, step: 3 },
    { label: "Atividade Física", icon: Apple, step: 4 },
    { label: "Preferências", icon: LifeBuoy, step: 5 },
  ];

  return (
    <aside className="w-full lg:w-72 bg-card text-card-foreground p-6 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4">📋 Menu</h2>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.step}>
            <a href="#" className={cn(
              "flex items-center gap-3 p-3 rounded-md transition-colors text-sm font-medium",
              currentStep === item.step 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted/50"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
