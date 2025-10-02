import { User } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Mail, MapPin, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(user);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card group">
      <div 
        onClick={() => navigate(`/user/${user.id}`)}
        className="cursor-pointer"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg flex-shrink-0">
            {user.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors truncate">
              {user.name}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.company.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{user.address.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default UserCard;
