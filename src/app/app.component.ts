import { Component } from '@angular/core';

import { AppService } from './app.service';

import { CityModel } from './Model/city.model';
import { DistrictModel } from './Model/district.model';
import { SonDurumModel } from './Model/son.durum.model';
import { DisplayModel } from './Model/display.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public ListCity: Array<CityModel> = new Array<CityModel>();
  public ListDistrict: Array<DistrictModel> = new Array<DistrictModel>();
  public ListDisplay: Array<DisplayModel> = new Array<DisplayModel>();

  public cityNgModel;
  public districtNgModel;

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
      let districtName: string = this.ListDistrict.filter(x => x.merkezId == this.districtNgModel)[0].ilce;

      this.appService.Search(this.districtNgModel).subscribe(response => {
        if (response[0]) {
          let tempModel: SonDurumModel = response[0];
          this.ListDisplay.unshift({
            displayNo: tempModel.istNo,
            city: this.cityNgModel,
            district: districtName,
            merkezId: tempModel.karYukseklik,
            sicaklik: tempModel.sicaklik,
            nem: tempModel.nem
          });
        }
      });
    }
  }

  public DeleteItemDisplayList(item: DisplayModel) {
    let index: number = this.ListDisplay.indexOf(item);
    if (index !== -1) {
      this.ListDisplay.splice(index, 1);
    }
  }

}
