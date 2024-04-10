import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { HttpClientModule } from '@angular/common/http';
import { Local } from '../../types/local.interface';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
  providers: [
    HttpClientModule
  ],
})
export class FormsComponent implements OnInit {
  results : Local[] = [];
  filterResults : Local[] = [];
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private unitService: GetUnitsService ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    });

    this.unitService.getAllUnits().subscribe(data => {
      this.results = data.locations;
      this.filterResults  = data.locations;
    });
  }

  onSubmit(): void {
    this.filterResults = this.results;
    if(!this.formGroup.value.showClosed) {
      this.filterResults = this.results.filter(local => local.opened === true);
    }
  }

  onClean(): void {
    this.formGroup.reset();
  }	

}
