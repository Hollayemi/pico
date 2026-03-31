export const adminMenu = [
  {
    name: "Dashboard",
    path: "/portals/admin/",
    icon: "dashboard",
    roles: ["super_admin", "admin", "principal"],
  },
  {
    name: "Admissions",
    path: "/portals/admin/admissions",
    icon: "user-plus",
    roles: ["super_admin", "admin"],
    children: [
      {
        name: "Applications",
        path: "/portals/admin/admissions/applications",
        roles: ["super_admin", "admin"],
      },
      {
        name: "Add Application",
        path: "/portals/admin/admissions/apply",
        roles: ["super_admin", "admin"],
      },
      {
        name: "Admission Screening",
        path: "/portals/admin/admissions/screening",
        roles: ["super_admin", "admin"],
      },
      {
        name: "Admission Offers",
        path: "/portals/admin/admissions/offers",
        roles: ["super_admin", "admin"],
      },
    ]
  },
  {
    name: "Students",
    path: "/portals/admin/students",
    icon: "users",
    roles: ["super_admin", "admin"],
    children: [
      { name: "All Students", path: "/portals/admin/students/all", roles: ["super_admin", "admin"] },
      { name: "Add Student", path: "/portals/admin/students/add", roles: ["super_admin", "admin"] },
      { name: "Promotions", path: "/portals/admin/students/promotions", roles: ["super_admin", "admin"] },
    ],
  },
  {
    name: "Staff",
    path: "/portals/admin/staff",
    icon: "briefcase",
    roles: ["super_admin", "admin"],
    children: [
      { name: "All Staff", path: "/portals/admin/staff/all", roles: ["super_admin", "admin"] },
      { name: "Add Staff", path: "/portals/admin/staff/add", roles: ["super_admin", "admin"] },
      { name: "Payroll", path: "/portals/admin/staff/payroll", roles: ["super_admin", "accountant"] },
    ],
  },
  {
    name: "Academics",
    path: "/portals/admin/academics",
    icon: "book",
    roles: ["super_admin", "admin", "principal"],
    children: [
      { name: "Classes", path: "/portals/admin/academics/classes", roles: ["super_admin", "admin"] },
      { name: "Subjects", path: "/portals/admin/academics/subjects", roles: ["super_admin", "admin"] },
      { name: "Timetable", path: "/portals/admin/academics/timetable", roles: ["super_admin", "admin", "principal"] },
    ],
  },
  // {
  //   name: "Attendance",
  //   path: "/portals/admin/attendance",
  //   icon: "calendar",
  //   roles: ["super_admin", "admin", "teacher"],
  // },
  {
    name: "Report",
    path: "/portals/admin/report",
    icon: "file-text",
    roles: ["super_admin", "admin", "teacher"],
    children: [
      { name: "Results", path: "/portals/admin/reports/results", roles: ["super_admin", "admin", "teacher"] },
      { name: "Report Cards", path: "/portals/admin/reports/cards", roles: ["super_admin", "admin"] },
    ],
  },
  {
    name: "Finance",
    path: "/portals/admin/finance",
    icon: "credit-card",
    roles: ["super_admin", "accountant"],
    children: [
      { name: "Fees", path: "/portals/admin/finance/fees", roles: ["super_admin", "accountant"] },
      { name: "Payments", path: "/portals/admin/finance/payments", roles: ["super_admin", "accountant"] },
      { name: "Invoices", path: "/portals/admin/finance/invoices", roles: ["super_admin", "accountant"] },
    ],
  },
  // {
  //   name: "Communication",
  //   path: "/portals/admin/communication",
  //   icon: "message",
  //   roles: ["super_admin", "admin", "principal"],
  // },
  // {
  //   name: "Library",
  //   path: "/portals/admin/library",
  //   icon: "library",
  //   roles: ["super_admin", "admin"],
  // },
  {
    name: "Transport",
    path: "/portals/admin/transport",
    icon: "bus",
    roles: ["super_admin", "admin"],
  },
  {
    name: "Inventory",
    path: "/portals/admin/inventory",
    icon: "box",
    roles: ["super_admin", "admin"],
  },
  // {
  //   name: "Reports",
  //   path: "/portals/admin/reports",
  //   icon: "bar-chart",
  //   roles: ["super_admin", "admin", "principal"],
  // },
  {
    name: "Settings",
    path: "/portals/admin/settings",
    icon: "settings",
    roles: ["super_admin"],
  },
];