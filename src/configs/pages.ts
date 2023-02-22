export const paths = {
  dashboard: "/",
  realtimeTracking: "/realtime-tracking",
  screenshots: "/screenshots",
  employees: "/employees",
  projectsTracking: "/projects-tracking",
  projectTrackingDetail: "/projects-tracking/:id/:slug",
  teams: "/teams",
  timeAndAttendance: "/time-and-attendance",
  appsAndWebsites: "/apps-and-websites",
  settings: "/settings",
};

const pages = [
  {
    icon: "",
    name: "Dashboard",
    path: paths.dashboard,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Real-Time Tracking",
    path: paths.realtimeTracking,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Screenshots",
    path: paths.screenshots,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Employees",
    path: paths.employees,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Projects Tracking",
    path: paths.projectsTracking,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Project Tracking Detail",
    path: paths.projectTrackingDetail,
    inSidebar: false,
  },
  {
    icon: "",
    name: "Teams",
    path: paths.teams,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Time and Attendance",
    path: paths.timeAndAttendance,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Apps and Websites",
    path: paths.appsAndWebsites,
    inSidebar: true,
  },
  {
    icon: "",
    name: "Settings",
    path: paths.settings,
    inSidebar: true,
  },
];

export default pages;
