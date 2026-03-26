import AdminLayout from "@/app/components/Admin/AdminLayout";
import { adminMenu } from "@/app/components/Admin/menuConfig";


// In a real app this comes from auth session / cookies
const MOCK_USER = {
  name: "Samuel Adeniyi",
  email: "principal@progressschool.com",
  role: "super_admin",
};

export default function AdminRootLayout({ children }) {
  return (
    <AdminLayout
      menu={adminMenu}
      userRole={MOCK_USER.role}
      user={MOCK_USER}
    >
      {children}
    </AdminLayout>
  );
}
