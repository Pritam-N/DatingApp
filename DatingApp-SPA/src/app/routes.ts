import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListsComponent } from './members/member-lists/member-lists.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolvers/list.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MessagesComponent } from './messages/messages.component';

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
            { path: 'member/edit', component: MemberEditComponent,
                    resolve: {user: MemberEditResolver},
                    canDeactivate: [PreventUnsavedChanges]},
            { path: 'messages', component: MessagesComponent,
                    resolve: {messages: MessagesResolver}},
            { path: 'list', component: ListsComponent,
                    resolve: {users: ListResolver} }
        ]
    },
    // if nothing matches, redirect to home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
