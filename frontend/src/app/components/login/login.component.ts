import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    returnUrl: string;
  
    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
    ) {
      // Redirect if already logged in
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
      
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      });
      
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }
  
    ngOnInit(): void {}
  
    get f() { return this.loginForm.controls; }
  
    onSubmit() {
      this.submitted = true;
  
      if (this.loginForm.invalid) {
        return;
      }
  
      this.loading = true;
      this.authService.login(this.f['email'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate([this.returnUrl]);
          },
          error: error => {
            this.error = error?.error?.error || 'Login failed';
            this.loading = false;
          }
        });
    }
  }
  