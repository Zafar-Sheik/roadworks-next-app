// app/admin/users/page.tsx
import { IUser } from "@/lib/models/User";
import UserTable from "./UserTable/UserTable";

export default async function AdminUsersPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);

  if (!response.ok) {
    const { message } = await response.json();
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {message}</div>
    );
  }

  const users: IUser[] = await response.json();

  return <UserTable users={users} />;
}
