import ParentLayout   from "@/app/components/Parent/ParentLayout";
import { parentMenu } from "@/app/components/Parent/menuConfig";

export default function ParentRootLayout({ children }) {
  return (
    <ParentLayout menu={parentMenu}>
      {children}
    </ParentLayout>
  );
}
