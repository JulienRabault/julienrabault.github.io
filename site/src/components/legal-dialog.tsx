import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { LegalContent } from "@/content/types";
import { cn } from "@/lib/utils";

/** Le lien discret de bas de page, et les mentions légales dans une fenêtre : rien à charger, rien à quitter. */
export function LegalDialog({ legal, className }: { legal: LegalContent; className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn("text-muted-foreground text-xs underline-offset-4 transition-colors hover:text-foreground hover:underline", className)}
          type="button"
        >
          {legal.link}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] gap-0 overflow-y-auto p-6 sm:max-w-xl sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-display font-semibold text-[22px] leading-tight tracking-[-0.025em]">{legal.title}</DialogTitle>
          <DialogDescription>{legal.updated}</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          {legal.sections.map((section) => (
            <section key={section.title}>
              <h3 className="font-medium text-[15px]">{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
