import * as React from "react";
import { cn } from "@/lib/utils";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(
  undefined
);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer");
  }
  return context;
};

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Drawer = ({ children, open: controlledOpen, onOpenChange }: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, children, asChild, onClick, ...props }, ref) => {
    const { setOpen } = useDrawer();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        ref,
      });
    }

    return (
      <button
        ref={ref}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DrawerTrigger.displayName = "DrawerTrigger";

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, side = "right", ...props }, ref) => {
    const { open, setOpen } = useDrawer();

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      if (open) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
        
        {/* Drawer Panel */}
        <div
          ref={ref}
          className={cn(
            "fixed z-50 flex h-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            side === "right" && "right-0 top-0 w-full max-w-md border-l border-slate-200",
            side === "left" && "left-0 top-0 w-full max-w-md border-r border-slate-200",
            open
              ? "translate-x-0"
              : side === "right"
                ? "translate-x-full"
                : "-translate-x-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4",
      className
    )}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto p-6", className)}
    {...props}
  />
));
DrawerBody.displayName = "DrawerBody";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4",
      className
    )}
    {...props}
  />
));
DrawerFooter.displayName = "DrawerFooter";

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const { setOpen } = useDrawer();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <i className="fas fa-times"></i>
    </button>
  );
});
DrawerClose.displayName = "DrawerClose";

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
};
