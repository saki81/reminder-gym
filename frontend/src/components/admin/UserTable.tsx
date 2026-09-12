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

import type { GetUsersParams } from "@/types";
import { useAllUsers } from "@/hooks/admin/useAllUsers";
import { useActivateUser } from "@/hooks/admin/useActivateUser";
import { useDeactivateUser } from "@/hooks/admin/useDeactivateUser";
import { useDeleteUser } from "@/hooks/admin/useDeleteUser";


const PAGE_SIZE = 12;


export const UserTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [deleteTarget, setDeleteTarget] = useState<{
        id: string;
        label: string;
    } | null>(null);

    const params: GetUsersParams = {
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status !== "all" ? status : undefined,
    };

    const { data, isLoading, isFetching, isError } = useAllUsers(params);
    const { mutate: activateUser, isPending: isActivating } = useActivateUser();
    const { mutate: deactivateUser, isPending: isDeactivating } = useDeactivateUser();
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

   
  
    const handleStatusChange = (value: string | null) => {
      if (!value) return
      setStatus(value);
      setPage(1);
}

    const handleConfirmDelete = () => {
     if (!deleteTarget) return;
 
      deleteUser(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };
      
    return (
     <Card className="p-0">
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Pretraga po imenu ili emailu..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
 
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-160">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Svi statusi</SelectItem>
            <SelectItem value="active">Aktivni</SelectItem>
            <SelectItem value="inactive">Neaktivni</SelectItem>
          </SelectContent>
        </Select>
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
            title="Greška pri učitavanju korisnika"
            description="Pokušaj da osvežiš stranicu ili probaj ponovo kasnije."
          />
        </div>
      )}
 
      {/* Empty state */}
      {!isLoading && !isError && data?.users.length === 0 && (
        <div className="py-12">
          <EmptyState
            title="Nema pronađenih korisnika"
            description="Pokušaj da promeniš filtere ili pretragu."
          />
        </div>
      )}
 
      {/* Table */}
      {!isLoading && !isError && data && data.users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ime</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verifikovan</TableHead>
              <TableHead>Teretane</TableHead>
              <TableHead>Kreiran</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Aktivan" : "Neaktivan"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.emailVerified ? "outline" : "secondary"}>
                    {user.emailVerified ? "Da" : "Ne"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.gyms.length === 0
                    ? "—"
                    : user.gyms.map((g) => g.gymName).join(", ")}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("sr-Latn-BA")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {user.isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeactivating}
                        onClick={() => deactivateUser(user.id)}
                      >
                        Deaktiviraj
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActivating}
                        onClick={() => activateUser(user.id)}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        Aktiviraj
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDeleteTarget({ id: user.id, label: user.name ?? user.email })
                      }
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    >
                      Obriši
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
            Strana {data.pagination.page} od {data.pagination.totalPages}
            {isFetching ? " · osvežavanje..." : ""}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prethodna
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Sledeća
            </Button>
          </div>
        </div>
      )}
 
      {/* Shared confirm dialog (shadcn Dialog ispod haube) */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Obriši korisnika"
        description={`Da li si siguran da želiš da obrišeš korisnika ${deleteTarget?.label ?? ""}? Ova akcija je nepovratna.`}
        confirmLabel="Obriši"
        cancelLabel="Otkaži"
        destructive
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );

}
