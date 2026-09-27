import { useForm, Controller, type DefaultValues, type UseFormSetError } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAllUsers } from "@/hooks/admin/useAllUsers";

export type GymFormValues = {
  gymName: string;
  city?: string;
  ownerId?: string;
};

type Props = {
  mode: "create" | "edit";
  defaultValues?: DefaultValues<GymFormValues>;
  onSubmit: (data: GymFormValues, setError: UseFormSetError<GymFormValues>) => void;
  isPending: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

export const GymForm = ({
  mode,
  defaultValues,
  onSubmit,
  isPending,
  onCancel,
  submitLabel = "Save",
}: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isDirty },
  } = useForm<GymFormValues>({ defaultValues });

  const { data: usersData, isLoading: usersLoading } = useAllUsers({
    status: "active",
    limit: 100,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, setError))}
      noValidate
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="gymName">Gym name</Label>
        <Input
          id="gymName"
          placeholder="e.g. FitZone Downtown"
          aria-invalid={!!errors.gymName}
          {...register("gymName")}
        />
        {errors.gymName && (
          <p className="text-xs text-destructive">{errors.gymName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="city">
          City{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="city"
          placeholder="e.g. Banja Luka"
          aria-invalid={!!errors.city}
          {...register("city")}
        />
        {errors.city && (
          <p className="text-xs text-destructive">{errors.city.message}</p>
        )}
      </div>

      {mode === "create" && (
        <div className="space-y-1.5">
          <Label htmlFor="owner">Owner</Label>
          <Controller
            name="ownerId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={(value) => field.onChange(value ?? "")}>
                <SelectTrigger id="owner" aria-invalid={!!errors.ownerId}>
                  <SelectValue
                    placeholder={usersLoading ? "Loading users..." : "Select an owner"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name ?? user.email} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.ownerId && (
            <p className="text-xs text-destructive">{errors.ownerId.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1"
          disabled={isPending || (!!defaultValues && !isDirty)}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Saving…
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};