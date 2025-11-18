import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student.model';

@Component({
  selector: 'student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];

  constructor(private svc: StudentService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.list().subscribe({
      next: (res) => (this.students = res || []),
      error: (err) => {
        console.error('Failed to load students', err);
        this.students = [];
      },
    });
  }

  remove(id: number) {
    if (!confirm('Delete this student?')) return;
    this.svc.delete(id).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Delete failed', err),
    });
  }
}
