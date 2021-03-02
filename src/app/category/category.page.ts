import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  private branch: any;
  
  constructor(private route: ActivatedRoute,private router: Router,private platform: Platform) { 

    this.route.queryParams.subscribe(params => {
      if (params && params.resturant) {
          this.branch = JSON.parse(params.resturant)
      }
    });
  }

  ngOnInit() {
    
  }

  
  

  details(category){
    let meals = null;
    if(category == "Special"){
      meals = this.branch.branchMeals;
    }else{
      meals = this.branch.resturant.meals[category];
    }     
    const navigationExtras: NavigationExtras = {
      queryParams: {
        meals: JSON.stringify(meals),
        specials: JSON.stringify(this.branch.branchMeals),
        category: category
      }
    }
    this.router.navigate(['details'],navigationExtras);
  }
}
