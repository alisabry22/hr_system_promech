import { INavbarData } from "./helper";

export const navbarData:INavbarData[]=[
  {
  routeLink:'dashboard',
    icon:'fal fa-home',
    label:'Dashboard',

  },
  {
    routeLink:'allemp',
      icon:'fal fa-user',
      label:'Employees',
      items:[
        {routeLink:'allemp', label:"All Employee"},
        {routeLink:'allemp/addemp', label:"Add Employee"},


      ],
    },
    {
      routeLink:'departments',
        icon:'fal fa-folder',
        label:'Departments',

      },

      {
        routeLink:'jobs',
          icon:"fas fa-user-md",
          label:'Jobs',
  
        },
    {
      routeLink:'emptime',
        icon:'far fa-clock',
        label:'Employee Time',
      },

      {
        routeLink:'splitexcel',
          icon:'fal fa-file-excel',
          label:'Split Sheets',
        },
        {
          routeLink:'uploadsheet',
            icon:'fal fa-upload',
            label:'Upload Sheet',
          },
          {
            routeLink:'reports',
              icon:'fal fa-file',
              label:'Reports',
            },
          

]
