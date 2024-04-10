import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { HttpClientModule } from '@angular/common/http';
import { Local } from '../../types/local.interface';
import { first } from 'rxjs';

const TURN_HOURS = {
  morning: { start: '06', end: '12' },
  afternoon: { start: '12', end: '18' },
  night: { start: '18', end: '23' }
};
type TURN_INDEX = 'morning' | 'afternoon' | 'night';

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

  filterUnits(unit: Local, filter_open_hour: number, filter_close_hour: number): any {
    if(!unit.schedules) return false;
    
    let today_weekday = "Seg. à Sex."; //new Date().getDay();

    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour;
      let schedule_weekdays = unit.schedules[i].weekdays;

      if(today_weekday === schedule_weekdays) {
        if(schedule_hour !== "Fechada"){
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ');
          let schedule_open_hour = parseInt(unit_open_hour.replace('h', ''), 10);
          let schedule_close_hour = parseInt(unit_close_hour.replace('h', ''), 10);

          return (schedule_open_hour <= filter_open_hour && schedule_close_hour >= filter_close_hour) 
        }
      }
    }
  }

  onSubmit(): void {
      let turnSelected : string = this.formGroup.value.hour;

      const OPEN_HOUR = TURN_HOURS[turnSelected as TURN_INDEX].start;
      const CLOSE_HOUR = TURN_HOURS[turnSelected as TURN_INDEX].end;
      this.filterResults = this.results.filter(local => this.filterUnits(local, parseInt(OPEN_HOUR, 10), parseInt(CLOSE_HOUR, 10)));

      this.filterResults.forEach((unit) => {
        console.log('unit: '+ unit.title + ' -> ' + unit.schedules[0].hour);
      });
  }

  onClean(): void {
    this.formGroup.reset();
  }	

}
