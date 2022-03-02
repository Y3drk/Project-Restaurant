import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  addingForm: FormGroup;

  formErrors = {
    email:'',
    password:''
  }

  private validationMessages = {
    email: {
      required: 'Email is required!',
      email: 'Email must be in the correct form'
    },
    password: {
      required: 'Password is required!',
      minlength: 'Password has to be at least 6 characters long'
    }
  }

  constructor(private formBuilder: FormBuilder, private authServ: AuthenticationService) { }

  ngOnInit(): void {
    this.addingForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    });

    this.addingForm.valueChanges.subscribe((value) => {
      debounceTime(1000);
      this.onControlValueChanged();
    });

    this.onControlValueChanged();
  }

  onControlValueChanged(){
    const form = this.addingForm;

    for (let field in this.formErrors){
      this.formErrors[field] = '';
      let control = form.get(field);

      if (control && control.dirty && !control.valid){
        const validationMessages = this.validationMessages[field];
        for(let key in control.errors){
          this.formErrors[field] += validationMessages[key] + ' ';
        }
      }
    }
  }

  onLogIn(form){
    this.authServ.logIn(form.value.email, form.value.password);
    alert('User logged-in!');
    this.addingForm.reset();
  }

}
