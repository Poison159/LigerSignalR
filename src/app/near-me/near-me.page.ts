import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-near-me',
  templateUrl: './near-me.page.html',
  styleUrls: ['./near-me.page.scss'],
})
export class NearMePage implements OnInit {

  private branches : any[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geolocation: Geolocation,
    private platform: Platform) {
      this.route.queryParams.subscribe(params => {
        if (params && params.branches) {
          this.branches = JSON.parse(params.branches);
        }
      });
     }

  ngOnInit() {
    
  }

  submitRating(){
    this.router.navigate(['rating']);
  }
  
  details(category, id){
    let meals = null;
    let branch = this.branches.filter(x => x.id == id)[0];
    if(category == "Special"){
      meals = branch.branchMeals;
    }else{
      meals = branch.resturant.meals[category];
    }     
    const navigationExtras: NavigationExtras = {
      queryParams: {
        meals: JSON.stringify(meals),
        specials: JSON.stringify(branch.branchMeals),
        category: category
      }
    }
    this.router.navigate(['details'],navigationExtras);
  }
  
  maps(branchAddress: string){
    this.geolocation.getCurrentPosition().then((resp) => {
    window.location.href = 'http://maps.google.com/maps?saddr=' +
    resp.coords.latitude.toString() + ', ' + resp.coords.longitude.toString()
    + '&daddr=' + encodeURIComponent(branchAddress);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

}
