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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="mx-auto max-w-7xl p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage roles and permissions
          </p>
        </div>
        <SearchUsers />
      </div>

      {/* User List Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b p-4 md:px-6 md:py-4">
          <CardTitle className="text-lg">Users</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No users found
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="group flex flex-col p-4 transition-colors hover:bg-muted/50 md:flex-row md:items-center md:justify-between md:px-6 md:py-4">
                  {/* User Info */}
                  <div className="flex flex-1 items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <RoleBadge role={user.publicMetadata.role as string} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {
                          user.emailAddresses.find(
                            (email) => email.id === user.primaryEmailAddressId
                          )?.emailAddress
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-end gap-2 md:mt-0 md:pl-4">
                    <UserActions user={user} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleBadge({ role }: { role?: string }) {
  const roleMap = {
    admin: {
      label: "Admin",
      variant: "default",
      class: "bg-purple-100 text-purple-800",
    },
    user: {
      label: "User",
      variant: "default",
      class: "bg-blue-100 text-blue-800",
    },
    none: { label: "No Role", variant: "outline", class: "border-gray-300" },
  };

  const { label, class: className } =
    roleMap[role as keyof typeof roleMap] || roleMap.none;

  return (
    <Badge
      variant="outline"
      className={`rounded-full text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

function UserActions({ user }: { user: any }) {
  const currentRole = (user.publicMetadata.role as string) || "none";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <form action={setRole}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="role" value="admin" />
          <DropdownMenuItem asChild className="cursor-pointer">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
              disabled={currentRole === "admin"}>
              <UserCheck className="h-4 w-4 text-purple-600" />
              Make Admin
            </button>
          </DropdownMenuItem>
        </form>

        <form action={setRole}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="role" value="user" />
          <DropdownMenuItem asChild className="cursor-pointer">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-2 py-1.5 text-sm"
              disabled={currentRole === "user"}>
              <User className="h-4 w-4 text-blue-600" />
              Make User
            </button>
          </DropdownMenuItem>
        </form>

        <form action={removeRole}>
          <input type="hidden" name="id" value={user.id} />
          <DropdownMenuItem asChild className="cursor-pointer">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-red-600">
              <UserX className="h-4 w-4" />
              Remove Role
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
