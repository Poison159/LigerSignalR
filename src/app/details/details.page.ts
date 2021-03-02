import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private meals: any;
  private category: any;
  private specials: any;
  constructor(private route: ActivatedRoute,private platform: Platform,private router:Router) { 
    
    this.route.queryParams.subscribe(params => {
      if (params && params.meals) {
          this.meals = JSON.parse(params.meals);
          this.specials = JSON.parse(params.meals);
          this.category = params.category;
      }
    });
  }

  ngOnInit() {
    
  }

}
