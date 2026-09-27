import { FormDialog } from "@/components/shared/FormDialog";
import { GymForm, type GymFormValues } from "@/components/admin/GymForm";
import { useCreateGym } from "@/hooks/gym/useCreateGym";
import { useUpdateGym } from "@/hooks/gym/useUpdateGym";
import { applyFieldErrors } from "@/hooks/shared/useFieldErrors";
import { UseFormSetError } from "react-hook-form";
import { CreateGymPayload, UpdateGymPayload } from "@/types";