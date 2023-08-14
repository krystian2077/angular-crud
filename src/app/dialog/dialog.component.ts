import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  statusList = ['On', 'Off'];

  campaignForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.campaignForm = this.formBuilder.group({
      campaignName: ['', Validators.required],
      category: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      town: ['', Validators.required],
      radius: ['', Validators.required],
      campaignFund: ['', Validators.required],
    });
  }

  addCampaign() {
    if (this.campaignForm.valid) {
      this.api.postCampaign(this.campaignForm.value).subscribe({
        next: (res) => {
          this.toastr.success('Product added successfully');
          this.campaignForm.reset();
          this.dialogRef.close('save');
        },
        error: () => {
          this.toastr.error('Error while adding the product');
        },
      });
    }
  }
}
