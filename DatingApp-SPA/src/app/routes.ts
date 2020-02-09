import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';

export const appRoutes: Routes = [
    // ordering is important
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListsComponent,
                    resolve: {users: MemberListResolver} },
            { path: 'members/:id', component: MemberDetailComponent,
                    resolve: {user: MemberDetailResolver} },
            { path: 'messages', component: ListsComponent},
            { path: 'list', component: ListsComponent }
        ]
    },
    // if nothing matches, redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
