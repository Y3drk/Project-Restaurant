import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  addingForm: FormGroup;

  formErrors = {
    email:'',
    password:'',
    nickname: '',
  }

  private validationMessages = {
    email: {
      required: 'email is required!',
      email: 'email must be in the correct form'
    },
    password: {
      required: 'password is required!',
      minlength: 'Password has to be at least 6 characters long'
    },
    nickname: {
      required: 'Nickname is required',
      minlength: 'Nickname has to be at least 6 characters!',
      maxlength: 'Nickname has to be shorter than 33 characters!'
    }
  }

  constructor(private formBuilder: FormBuilder, private authServ: AuthenticationService) { }

  ngOnInit(): void {
    this.addingForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      nickname: ['',[Validators.required, Validators.minLength(6), Validators.maxLength(32)]]
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

  onSignUp(form){
    console.log(form.value);

    this.authServ.signUp(form.value.email,  form.value.password , form.value.nickname);

    alert('New user signed-up!');
    this.addingForm.reset();
  }

}
