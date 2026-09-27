import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    formId: string;
    isSubmitting?: boolean;
    submitLabel?: string;
    cancelLabel?: string;
    children: React.ReactNode;
}


export const FormDialog = ({
    open,
    onOpenChange,
    title,
    description,
    formId,
    isSubmitting = false,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    children,
}: FormDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>

            {children}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
               >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                form={formId}
                disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
};