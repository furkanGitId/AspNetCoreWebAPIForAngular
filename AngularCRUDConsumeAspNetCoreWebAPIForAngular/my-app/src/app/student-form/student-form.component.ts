import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html',
})
export class StudentFormComponent implements OnInit {
  form: any;

  isEdit = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private svc: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = Number(idParam);
      this.svc.get(this.id).subscribe({
        next: (s) => this.form.patchValue({ name: s.name }),
        error: (err) => console.error('Failed to load student', err),
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = { name: this.form.value.name } as any;
    if (this.isEdit && this.id != null) {
      this.svc.update(this.id, payload).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.svc.create(payload).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (err) => console.error('Create failed', err),
      });
    }
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
