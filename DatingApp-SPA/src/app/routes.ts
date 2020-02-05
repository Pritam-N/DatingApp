import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListsComponent } from './member-lists/member-lists.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
    // ordering is important
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListsComponent },
            { path: 'messages', component: ListsComponent},
            { path: 'list', component: ListsComponent }
        ]
    },
    // if nothing matches, redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
