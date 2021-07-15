import Home from "views/Home.js";
import Onibus from "views/Onibus.js";

const dashboardRoutes = [
  {
    path: "/inicio",
    name: "Início",
    icon: "nc-icon nc-chart-pie-35",
    component: Home
  },
  {
    path: "/onibus",
    name: "Ônibus",
    icon: "nc-icon nc-bus-front-12",
    component: Onibus,
  }
];

export default dashboardRoutes;
