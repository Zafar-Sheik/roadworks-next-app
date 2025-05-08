import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "./SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, User, UserCheck, UserX } from "lucide-react";

export default async function AdminUsers(params: {
  searchParams: Promise<{ search?: string }>;
}) {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const query = (await params.searchParams).search;
  const client = await clerkClient();

  const users = (
    await client.users.getUserList(query ? { query } : { limit: 500 })
  ).data;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Manage user roles and permissions
          </p>
        </div>
        <SearchUsers />
      </div>

      <Card>
        <CardHeader className="flex border-b p-4 md:p-6">
          <CardTitle className="text-lg">User List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-5 md:col-span-4">User</div>
                <div className="hidden md:col-span-3 md:block">Email</div>
                <div className="col-span-4 md:col-span-3">Role</div>
                <div className="col-span-3 md:col-span-2">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {users.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No users found matching your criteria
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-5 md:col-span-4 font-medium text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-400" />
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                      <div className="hidden md:col-span-3 md:block text-gray-600">
                        {
                          user.emailAddresses.find(
                            (email) => email.id === user.primaryEmailAddressId
                          )?.emailAddress
                        }
                      </div>
                      <div className="col-span-4 md:col-span-3">
                        <RoleBadge role={user.publicMetadata.role as string} />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <UserActions user={user} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleBadge({ role }: { role?: string }) {
  const roleMap = {
    admin: { label: "Admin", variant: "default" as const },
    user: { label: "User", variant: "default" as const },
    none: { label: "No Role", variant: "outline" as const },
  };

  const { label, variant } =
    roleMap[role as keyof typeof roleMap] || roleMap.none;

  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
}

function UserActions({ user }: { user: any }) {
  const currentRole = (user.publicMetadata.role as string) || "none";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <form action={setRole}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="role" value="admin" />
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full gap-2 cursor-pointer"
              disabled={currentRole === "admin"}>
              <UserCheck className="h-4 w-4" />
              Make Admin
            </button>
          </DropdownMenuItem>
        </form>

        <form action={setRole}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="role" value="user" />
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full gap-2 cursor-pointer"
              disabled={currentRole === "user"}>
              <User className="h-4 w-4" />
              Make User
            </button>
          </DropdownMenuItem>
        </form>

        <form action={removeRole}>
          <input type="hidden" name="id" value={user.id} />
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full gap-2 cursor-pointer text-red-600">
              <UserX className="h-4 w-4" />
              Remove Role
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
