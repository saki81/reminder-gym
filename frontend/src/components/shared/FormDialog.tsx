import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,  
} from "@/components/ui/dialog";


interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}


export const FormDialog = ({
    open,
    onOpenChange,
    title,
    description,
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

          </DialogContent>
        </Dialog>
    );
};