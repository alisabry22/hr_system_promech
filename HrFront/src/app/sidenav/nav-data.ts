import { INavbarData } from "./helper";

export const navbarData:INavbarData[]=[
  {
  routeLink:'dashboard',
    icon:'pi pi-home',
    label:'Dashboard',

  },
  {
    routeLink:'allemp',
      icon:'pi pi-user',
      label:'Employees',
      items:[
        {routeLink:'allemp', label:"All Employee"},
        {routeLink:'allemp/addemp', label:"Add Employee"},


      ],
    },
    {
      routeLink:'departments',
        icon:'pi pi-folder',
        label:'Departments',

      },

      {
        routeLink:'jobs',
          icon:"pi pi-briefcase",
          label:'Jobs',

        },
    {
      routeLink:'emptime',
        icon:'pi pi-stopwatch',
        label:'Employee Time',
      },

      {
        routeLink:'splitexcel',
          icon:'pi pi-file-excel',
          label:'Split Sheets',
        },
        {
          routeLink:'uploadsheet',
            icon:'pi pi-upload',
            label:'Upload Sheet',
          },
          {
            routeLink:'timereport',
              icon:'pi pi-file',
              label:'Reports',
            },
            {
              routeLink:'history',
                icon:'pi pi-history',
                label:'history',
              },


]
