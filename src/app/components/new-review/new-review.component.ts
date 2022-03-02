import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {ReviewsService} from "../../services/ReviewsService";

@Component({
  selector: 'app-new-review',
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.css']
})
export class NewReviewComponent implements OnInit {
  @Input() dish;

  addingReviewForm: FormGroup;

  formErrors ={
    nickname: '',
    reviewName:'',
    reviewText:'',
    dateOfOrder:'',
  }

  private validationMessages = {
    nickname: {
      required: 'Nickname is required!',
      maxlength: 'Nickname cannot be longer than 32 characters!',

    },
    reviewName: {
      required: 'review name is required!',

    },
    reviewText: {
      required: 'Review text is required!',
      minlength: 'Review has to be longer than 50 characters!',
      maxlength: 'Review has to shorter than 500 characters!'
    },
    dateOfOrder: {}
  }

  constructor(private formBuilder : FormBuilder, public reviewsService: ReviewsService) { }

  ngOnInit(): void {
    this.addingReviewForm = this.formBuilder.group({
      nickname: ['', [Validators.required, Validators.maxLength(32)]],
      reviewName: ['',[Validators.required]],
      reviewText: ['',[Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      dateOfOrder: [''],
    });

    this.addingReviewForm.valueChanges.subscribe((value) => {
      debounceTime(1000);
      this.onControlValueChanged();
    });

    this.onControlValueChanged();
  }

  onControlValueChanged(){
    const form = this.addingReviewForm;

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

  onSubmit(form){
    this.reviewsService.adNewReview(form.value, this.dish);
    alert("New Review Added!");
    this.addingReviewForm.reset();
  }


}
