import { useState, useMemo } from "react";
import { User } from "@/types/user";
import { useUsers } from "@/contexts/UserContext";
import UserCard from "@/components/UserCard";
import SearchBar from "@/components/SearchBar";
import AddUserDialog from "@/components/AddUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import SortDropdown, { SortField } from "@/components/SortDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  
  const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortField) {
          case "name":
            return a.name.localeCompare(b.name);
          case "email":
            return a.email.localeCompare(b.email);
          case "company":
            return a.company.name.localeCompare(b.company.name);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [users, searchQuery, sortField]);

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      toast.success("User deleted successfully!");
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">User Management</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage and browse your user directory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex gap-3">
            <SortDropdown onSort={setSortField} />
            <AddUserDialog onAddUser={addUser} />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No users found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user}
                onEdit={setEditingUser}
                onDelete={setDeletingUser}
              />
            ))}
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUpdateUser={updateUser}
        />
      )}

      {deletingUser && (
        <DeleteConfirmDialog
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={handleDeleteConfirm}
          userName={deletingUser.name}
        />
      )}
    </div>
  );
};

export default Index;
