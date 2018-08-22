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

  public UpdateOptions = {
    State: true,
    IntervalModel: null,
    UpdateTime: 15
  };

  public GeoLocationOptions = {
    Lat: -1,
    Lon: -1
  };

  constructor(private appService: AppService) {
    this.ListCity = new Array<CityModel>();

    this.appService.GetCityList().subscribe(response => {
      this.ListCity = response;
      this.ListCity = this.ListCity.sort((a, b) => {
        if (a.il < b.il)
          return -1;
        if (a.il > b.il)
          return 1;
        return 0;
      });
    });

    this.UpdateFromInterval();
    this.GetLocation();
  }

  public ChangeCity(event) {
    this.ListDistrict = new Array<DistrictModel>();

    this.appService.GetDistrictListFromCity(event).subscribe(response => {
      this.ListDistrict = response;
      this.ListDistrict = this.ListDistrict.sort((a, b) => {
        if (a.ilce < b.ilce)
          return -1;
        if (a.ilce > b.ilce)
          return 1;
        return 0;
      });
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
            merkezId: this.districtNgModel,
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

  public UpdateAllList() {
    this.ListDisplay.forEach(x => {
      this.appService.Search(x.merkezId).subscribe(response => {
        if (response[0]) {
          let tempModel: SonDurumModel = response[0];

          x.sicaklik = tempModel.sicaklik;
          x.nem = tempModel.nem;
        }
      });
    });
  }

  public UpdateFromInterval() {
    if (this.UpdateOptions.IntervalModel) {
      clearInterval(this.UpdateOptions.IntervalModel);
      this.UpdateOptions.IntervalModel = null;
    }

    this.UpdateOptions.IntervalModel = setInterval(() => {
      if (this.UpdateOptions.State) {
        this.UpdateAllList();
      }
    }, 1000 * this.UpdateOptions.UpdateTime);
  }

  public GetLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.GeoLocationOptions.Lat = position.coords.latitude;
        this.GeoLocationOptions.Lon = position.coords.longitude;

        this.GetSearchInfoFromLocation();
      });
    }
  }

  public GetSearchInfoFromLocation() {
    this.appService.GetInfoFromLatLon(this.GeoLocationOptions.Lat, this.GeoLocationOptions.Lon).subscribe(x => {
      if (x) {
        let tempInfo = x;
        this.appService.Search(tempInfo.merkezId).subscribe(response => {
          if (response[0]) {
            let tempModel: SonDurumModel = response[0];
            this.ListDisplay.unshift({
              displayNo: tempModel.istNo,
              city: tempInfo.il,
              district: tempInfo.ilce,
              merkezId: tempInfo.merkezId,
              sicaklik: tempModel.sicaklik,
              nem: tempModel.nem
            });
          }
        });
      }
    });
  }

}
