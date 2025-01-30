// src/data/navData.js

import { FaHome, FaInfoCircle, FaDollarSign, FaRobot } from "react-icons/fa";

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
    path: "/interactions",
    name: "Logs",
    icon: <FaRobot />,
  },
];
