import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AuthService } from '../../../services/auth/auth.service';
import { AuthResponse } from '../../../services/auth/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.createFormGroup();
  }

  onSubmit() {
    this.markControlsTouched();
    if (this.loginForm.valid) {
      const username = this.loginForm.controls.username.value;
        const password = this.loginForm.controls.password.value;
        this.loading = true;
        this.authService.login(username, password);
        this.authService.getLoadingChangedLogin().pipe(take(1)).subscribe(
          (loading: boolean) => {
            this.loading = loading;
            const response: AuthResponse = this.authService.getServerResponseLogin();
            if (response.status === 'SUCCESS') {
              this.router.navigate(['/overview']);
            }
          }
        );
    } else {
      console.log('form invalid');
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', {
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        validators: [Validators.required]
      })
    });
  }

  markControlsTouched() {
    Object
      .keys(this.loginForm.controls)
      .forEach(field => {
        const control = this.loginForm.get(field);
        control.markAsTouched({onlySelf: true});
      });
  }

  getFormControlErrors(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors.required) {
        return 'This is a required field.';
      }
    }
    return '';
  }
}
