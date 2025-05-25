import { Routes } from '@angular/router';
 

export const routes: Routes = [
 
    
   
      { path: 'admin',
        loadChildren: () => import('./layout/layout-main/layout-main.routes'),
      },
      {
        path: '**',
        redirectTo: 'admin/landing',
      },

]
