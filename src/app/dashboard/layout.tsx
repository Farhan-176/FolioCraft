import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("auth_token")?.value;

  if (!token) {
    redirect("/login?next=/dashboard");
  }

  return children;
}