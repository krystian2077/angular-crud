import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { ToastrService } from 'ngx-toastr';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Campaign System Manager';
  displayedColumns: string[] = [
    'campaignName',
    'category',
    'title',
    'price',
    'status',
    'town',
    'radius',
    'campaignFund',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllCampaigns();
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllCampaigns();
        }
      });
  }

  getAllCampaigns() {
    this.api.getCampaign().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.toastr.error('Error while fetching the Records!');
      },
    });
  }

  editCampaign(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '600px',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllCampaigns();
        }
      });
  }

  deleteCampaign(id: number) {
    this.api.deleteCampaign(id).subscribe({
      next: (res) => {
        this.toastr.success('Product deleted successfully');
        this.getAllCampaigns();
      },
      error: () => {
        this.toastr.error('Error while deleting campaign!');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
