import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditUserDialog from "@/components/EditUserDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building2, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, isLoading, updateUser, deleteUser } = useUsers();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const user = getUserById(Number(id));

  const handleDelete = () => {
    if (user) {
      deleteUser(user.id);
      toast.success("User deleted successfully!");
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <Button onClick={() => navigate("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border-border">
            <div className="flex items-start gap-6 mb-6">
              <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-3xl flex-shrink-0">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                <p className="text-muted-foreground text-lg">@{user.username}</p>
              </div>
            </div>

            <div className="flex gap-3 mb-8 pb-6 border-b border-border">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit User
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete User
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground break-all">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{user.phone}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                        <a
                          href={`https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {user.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {(user.address.street || user.address.city) && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      Address
                    </h3>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-foreground">
                          {user.address.suite && user.address.street && (
                            <p>{user.address.suite}, {user.address.street}</p>
                          )}
                          {user.address.city && user.address.zipcode && (
                            <p>{user.address.city}, {user.address.zipcode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {user.company.name && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Company
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground font-semibold">{user.company.name}</span>
                    </div>
                    {user.company.catchPhrase && (
                      <div className="pl-8">
                        <p className="text-sm text-muted-foreground italic mb-2">
                          "{user.company.catchPhrase}"
                        </p>
                      </div>
                    )}
                    {user.company.bs && (
                      <div className="pl-8">
                        <p className="text-sm text-muted-foreground">
                          {user.company.bs}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <EditUserDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateUser={updateUser}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        userName={user.name}
      />
    </div>
  );
};

export default UserDetails;
