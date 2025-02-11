import { FaInfoCircle, FaBookOpen, FaCoins, FaRobot } from "react-icons/fa";
import { MdDescription } from "react-icons/md";

export const navItems = [
  {
    id: 1,
    path: "/about",
    name: "About",
    icon: <FaInfoCircle />,
  },
  {
    id: 2,
    path: "/form",
    name: "Form",
    icon: <FaRobot />,
  },
  {
    id: 3,
    path: "/social-stories",
    name: "Stories",
    icon: <FaBookOpen />,
  },
  {
    id: 4,
    path: "/payment",
    name: "Credits",
    icon: <FaCoins />,
  },
  {
    id: 5,
    path: "/history",
    name: "Logs",
    icon: <MdDescription />,
  },
];
