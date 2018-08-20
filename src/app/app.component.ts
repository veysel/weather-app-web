import { Component } from '@angular/core';

import { AppService } from './app.service';

import { CityModel } from './Model/city.model';
import { DistrictModel } from './Model/district.model';
import { SonDurumModel } from './Model/son.durum.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public ListCity: Array<CityModel> = new Array<CityModel>();
  public ListDistrict: Array<DistrictModel> = new Array<DistrictModel>();

  public cityNgModel;
  public districtNgModel;

  public resultText = "";

  constructor(private appService: AppService) {
    this.ListCity = new Array<CityModel>();

    this.appService.GetCityList().subscribe(response => {
      this.ListCity = response;
    });
  }

  public ChangeCity(event) {
    this.ListDistrict = new Array<DistrictModel>();

    this.appService.GetDistrictListFromCity(event).subscribe(response => {
      this.ListDistrict = response;
    });
  }

  public Search() {
    if (this.districtNgModel) {
      this.appService.Search(this.districtNgModel).subscribe(response => {
        if (response[0]) {
          let tempModel: SonDurumModel = response[0];
          this.resultText = tempModel.sicaklik + " °C";
        }
      });
    }
  }

}
