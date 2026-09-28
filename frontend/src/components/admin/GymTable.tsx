import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";

import { ConfirmDialog } from "../shared/ConfirmDialog";
import { EmptyState } from "../shared/EmptyState";
import { Loader } from "../shared/Loader";
import { GymFormDialog } from "./GymFormDialog";

import type { GetGymsParams, AdminGym } from "@/types";
import { useAllGyms } from "@/hooks/admin/useAllGyms";
import { useActivateGym } from "@/hooks/admin/useActivateGym";
import { useDeactivateGym } from "@/hooks/admin/useDeactivateGym";
import { useDeleteGym } from "@/hooks/admin/useDeleteGym";

const PAGE_SIZE = 12;

type EditableGym = Pick<AdminGym, "id" | "gymName" | "city">;
type FormDialogState = { mode: "create" } | { mode: "edit"; gym: EditableGym } | null;

interface GymTableProps {
  onViewDetails: (gymId: string) => void;
}

export const GymTable = ({ onViewDetails }: GymTableProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [formDialog, setFormDialog] = useState<FormDialogState>(null);

  const params: GetGymsParams = {
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: status !== "all" ? status : undefined,
  };

  const { data, isLoading, isFetching, isError } = useAllGyms(params);
  const { mutate: activateGym, isPending: isActivating } = useActivateGym();
  const { mutate: deactivateGym, isPending: isDeactivating } = useDeactivateGym();
  const { mutate: deleteGym, isPending: isDeleting } = useDeleteGym();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    setStatus(value);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    deleteGym(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  const formDialogKey =
    formDialog === null
      ? "closed"
      : formDialog.mode === "edit"
      ? `edit-${formDialog.gym.id}`
      : "create";

  return (
    <Card className="p-0">
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by gym name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-xs"
          />

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-70">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" onClick={() => setFormDialog({ mode: "create" })}>
          Add gym
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="py-12">
          <EmptyState
            title="Error loading gyms"
            description="Try refreshing the page or try again later."
          />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && data?.gyms.length === 0 && (
        <div className="py-12">
          <EmptyState
            title="No gyms found"
            description="Try changing the filters or search term."
          />
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && data && data.gyms.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gym name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-left w-5">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.gyms.map((gym) => (
              <TableRow key={gym.id}>
                <TableCell className="font-medium">{gym.gymName}</TableCell>
                <TableCell className="text-muted-foreground">{gym.city}</TableCell>
                <TableCell className="text-muted-foreground">
                  {gym.owner ? gym.owner.name : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={gym.isActive ? "default" : "secondary"}>
                    {gym.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {gym.counts.equipments}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(gym.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(gym.id)}>
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormDialog({
                          mode: "edit",
                          gym: { id: gym.id, gymName: gym.gymName, city: gym.city },
                        })
                      }
                    >
                      Edit
                    </Button>
                    {gym.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeactivating}
                        onClick={() => deactivateGym(gym.id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActivating}
                        onClick={() => activateGym(gym.id)}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget({ id: gym.id, label: gym.gymName })}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {data.pagination.page} of {data.pagination.totalPages}
            {isFetching ? " · refreshing..." : ""}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create / edit dialog */}
      <GymFormDialog
        key={formDialogKey}
        open={!!formDialog}
        onOpenChange={(open) => {
          if (!open) setFormDialog(null);
        }}
        mode={formDialog?.mode ?? "create"}
        gym={formDialog?.mode === "edit" ? formDialog.gym : undefined}
      />

      {/* Shared confirm dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete gym"
        description={`Are you sure you want to delete "${deleteTarget?.label ?? ""}"? This action is irreversible.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
};