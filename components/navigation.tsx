"use client";

import { Home, PiggyBank, LineChart, MessageSquare, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Expenses", href: "/expenses", icon: DollarSign },
  { name: "Portfolio", href: "/portfolio", icon: LineChart },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="container max-w-md mx-auto">
        <div className="flex justify-between px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center py-2 px-3 text-sm",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="mt-1 text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}