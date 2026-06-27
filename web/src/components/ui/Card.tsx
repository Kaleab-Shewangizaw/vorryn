import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-lg",
        "bg-gradient-to-br from-[#050505] to-[#0d0d0d]",
        "border border-vorryn-steel/40",
        "shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1",
        "hover:border-vorryn-glow-end/60",
        "hover:shadow-[0_0_25px_rgba(194,65,12,0.2),inset_0_0_15px_rgba(194,65,12,0.1)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-cinzel text-sm font-bold uppercase tracking-widest text-slate-200",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs text-slate-500 leading-relaxed mt-1.5 font-sans", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center px-6 pb-6 pt-4 border-t border-vorryn-steel/20",
        className
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
