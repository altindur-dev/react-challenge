import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/user";

interface UserContextType {
  users: User[];
  isLoading: boolean;
  addUser: (name: string, email: string, phone?: string, website?: string, company?: string) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  getUserById: (id: number) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [deletedUserIds, setDeletedUserIds] = useState<Set<number>>(new Set());

  const { data: apiUsers = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      return response.json() as Promise<User[]>;
    },
  });

  const allUsers = [...localUsers, ...apiUsers.filter(user => !deletedUserIds.has(user.id))];

  const addUser = (name: string, email: string, phone = "", website = "", company = "") => {
    const newUser: User = {
      id: Math.max(0, ...allUsers.map(u => u.id)) + 1,
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, ""),
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: { lat: "", lng: "" },
      },
      phone,
      website,
      company: {
        name: company,
        catchPhrase: "",
        bs: "",
      },
    };
    setLocalUsers([newUser, ...localUsers]);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setLocalUsers(prevUsers => {
      const existingUser = prevUsers.find(u => u.id === id);
      if (existingUser) {
        return prevUsers.map(u => u.id === id ? { ...u, ...updates } : u);
      } else {
        const apiUser = apiUsers.find(u => u.id === id);
        if (apiUser) {
          return [{ ...apiUser, ...updates }, ...prevUsers];
        }
      }
      return prevUsers;
    });
  };

  const deleteUser = (id: number) => {
    setLocalUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    setDeletedUserIds(prev => new Set([...prev, id]));
  };

  const getUserById = (id: number) => {
    return allUsers.find(u => u.id === id);
  };

  return (
    <UserContext.Provider
      value={{
        users: allUsers,
        isLoading,
        addUser,
        updateUser,
        deleteUser,
        getUserById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
