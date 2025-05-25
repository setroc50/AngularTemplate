import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout-main.component';
import { AdminLandinPageComponent } from '../../pages/admin-landin-page/admin-landin-page.component';

import { DynamicPageComponent } from '../../shared/components/dynamic-page/dynamic-page.component';


export const layoutMainRoutes: Routes = [
    {
      path: '',
        component:LayoutMainComponent ,
        children: [

          {
            path: ':group/:name',
            component: DynamicPageComponent,
          },
          {
            path: 'landing',
            component: AdminLandinPageComponent,
          },

        ]
    },


  {
    path: '**',
    redirectTo: 'landing',
  },
];

export default layoutMainRoutes;


