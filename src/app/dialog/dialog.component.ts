import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  statusList = ['On', 'Off'];

  campaignForm!: FormGroup;
  actionBtn: string = 'Save';

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.campaignForm = this.formBuilder.group({
      campaignName: ['', Validators.required],
      category: ['', Validators.required],
      title: ['', Validators.required],
      price: ['', Validators.required],
      status: ['', Validators.required],
      town: ['', Validators.required],
      radius: ['', Validators.required],
      campaignFund: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.campaignForm.controls['campaignName'].setValue(
        this.editData.campaignName
      );
      this.campaignForm.controls['category'].setValue(this.editData.category);
      this.campaignForm.controls['title'].setValue(this.editData.title);
      this.campaignForm.controls['price'].setValue(this.editData.price);
      this.campaignForm.controls['status'].setValue(this.editData.status);
      this.campaignForm.controls['town'].setValue(this.editData.town);
      this.campaignForm.controls['radius'].setValue(this.editData.radius);
      this.campaignForm.controls['campaignFund'].setValue(
        this.editData.campaignFund
      );
    }
  }

  addCampaign() {
    if (!this.editData) {
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
    } else {
      this.updateCampaign();
    }
  }

  updateCampaign() {
    this.api.putCampaign(this.campaignForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.toastr.success('Product update successfully');
        this.campaignForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        this.toastr.error('Error while updating product!');
      },
    });
  }
}
