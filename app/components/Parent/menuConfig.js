export const parentMenu = [
  {
    name: "Dashboard",
    path: "/portals/parent",
    icon: "layout-dashboard",
    roles: ["parent"],
  },
  {
    name: "My Children",
    path: "/portals/parent/children",
    icon: "users",
    roles: ["parent"],
    children: [
      { name: "All Children",  path: "/portals/parent/children/all",     roles: ["parent"] },
      { name: "Child Profile", path: "/portals/parent/children/profile", roles: ["parent"] },
    ],
  },
  {
    name: "Admissions",
    path: "/portals/parent/admissions",
    icon: "user-plus",
    roles: ["parent"],
    children: [
      { name: "My Applications", path: "/portals/parent/admissions",       roles: ["parent"] },
      { name: "New Application",  path: "/portals/parent/admissions/apply", roles: ["parent"] },
    ],
  },
  {
    name: "Academics",
    path: "/portals/parent/academics",
    icon: "book-open",
    roles: ["parent"],
    children: [
      { name: "Results",      path: "/portals/parent/academics/results",   roles: ["parent"] },
      { name: "Report Cards", path: "/portals/parent/academics/reports",   roles: ["parent"] },
      { name: "Subjects",     path: "/portals/parent/academics/subjects",  roles: ["parent"] },
      { name: "Timetable",    path: "/portals/parent/academics/timetable", roles: ["parent"] },
    ],
  },
  {
    name: "Attendance",
    path: "/portals/parent/attendance",
    icon: "calendar",
    roles: ["parent"],
  },
  {
    name: "Finance",
    path: "/portals/parent/finance",
    icon: "credit-card",
    roles: ["parent"],
    children: [
      { name: "Fees",     path: "/portals/parent/finance/fees",     roles: ["parent"] },
      { name: "Payments", path: "/portals/parent/finance/payments", roles: ["parent"] },
      { name: "Invoices", path: "/portals/parent/finance/invoices", roles: ["parent"] },
    ],
  },
  {
    name: "Communication",
    path: "/portals/parent/communication",
    icon: "message-square",
    roles: ["parent"],
    children: [
      { name: "Messages",      path: "/portals/parent/communication/messages",      roles: ["parent"] },
      { name: "Announcements", path: "/portals/parent/communication/announcements", roles: ["parent"] },
    ],
  },
  {
    name: "Assignments",
    path: "/portals/parent/assignments",
    icon: "file-text",
    roles: ["parent"],
  },
  {
    name: "Events",
    path: "/portals/parent/events",
    icon: "calendar",
    roles: ["parent"],
  },
  {
    name: "Settings",
    path: "/portals/parent/settings",
    icon: "settings",
    roles: ["parent"],
  },
];
