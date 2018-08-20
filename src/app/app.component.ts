import { Component } from '@angular/core';

import { AppService } from './app.service';

import { CityModel } from './Model/city.model';
import { DistrictModel } from './Model/district.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private ListCity: Array<CityModel> = new Array<CityModel>();
  private ListDistrict: Array<DistrictModel> = new Array<DistrictModel>();

  private cityNgModel;
  private districtNgModel;

  constructor(private appService: AppService) {
    this.ListCity = new Array<CityModel>();

    this.appService.GetCityList().subscribe(response => {
      this.ListCity = response;
    });
  }

  private ChangeCity(event) {
    this.ListDistrict = new Array<DistrictModel>();

    this.appService.GetDistrictListFromCity(event).subscribe(response => {
      this.ListDistrict = response;
    });
  }

  private Search() {
    
  }

}
