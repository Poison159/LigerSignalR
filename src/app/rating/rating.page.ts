import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  private numbers : any;
  private rate = 0;
  constructor() { 
    this.numbers = [1,2,3,4,5];
  }

  ngOnInit() {
  }


}
