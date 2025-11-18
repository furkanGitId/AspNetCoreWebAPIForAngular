import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'students', pathMatch: 'full' },
	{
		path: 'students',
		loadComponent: () => import('./student-list/student-list.component').then((m) => m.StudentListComponent),
	},
	{
		path: 'students/new',
		loadComponent: () => import('./student-form/student-form.component').then((m) => m.StudentFormComponent),
	},
	{
		path: 'students/:id/edit',
		loadComponent: () => import('./student-form/student-form.component').then((m) => m.StudentFormComponent),
	},
];
