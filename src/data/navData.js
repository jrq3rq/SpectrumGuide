// src/data/navData.js

import {
  FaHome,
  FaInfoCircle,
  FaDollarSign,
  FaRobot,
  FaBookOpen,
} from "react-icons/fa";

export const navItems = [
  {
    id: 1,
    path: "/",
    name: "Home",
    icon: <FaHome />,
  },
  {
    id: 2,
    path: "/about",
    name: "About",
    icon: <FaInfoCircle />,
  },
  {
    id: 3,
    path: "/payment",
    name: "Payment",
    icon: <FaDollarSign />,
  },
  {
    id: 4,
    path: "/social-stories",
    name: "Stories",
    icon: <FaBookOpen />,
  },
  {
    id: 5,
    path: "/interactions",
    name: "Logs",
    icon: <FaRobot />,
  },
];
