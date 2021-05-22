import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  //slider setting variable
  responsiveOptions: any;

  //define validable to store dynamic products data
  products:any;

  constructor(private http: HttpClient) {
    //slider responsive settings
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    //get request
    this.http.get('https://www.testjsonapi.com/products/').subscribe(data => {
      //data storing for use in html component
      this.products = data;
    }, error => console.error(error));
  }

  ngOnInit(): void {
  }

}
