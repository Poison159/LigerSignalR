import { Component, OnInit } from '@angular/core';
import { ResturantService } from '../services/resturants.service.ts/resturantService';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ActionSheetController, Platform, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import { LogModPage } from '../log-mod/log-mod.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private resturant: any;
  private temp: any;
  private user: any;
  private backButtonSubscription: any;
  private branches: any;
  private searchStr ="";
  private imgUrl = '../../assets/images/icon.png';
  
  
  constructor(
    private resturantServ: ResturantService, 
    private router: Router,
    private platform: Platform,
    private barcodeScanner:BarcodeScanner,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    private alertController : AlertController,
    private storage : Storage,
    private geolocation: Geolocation,
    public route: ActivatedRoute,
    public toastController: ToastController,
    public modalController: ModalController,) {
      this.route.queryParams.subscribe(params => {
        if (params && params.token) {
          this.temp = JSON.parse(params.token);
          this.user = this.temp._user;
        }
      });
    }

  ngOnInit(): void {
    if(!this.temp){
      this.storage.get("lg-token").then(res => {
        this.user = res._user;
      });
    }
  }

   async search(){
     if(this.searchStr ==""){
       alert("Please type name in search field");
     }else{
      const loading = await this.loadingController.create({
        message: 'Searching resturants...',
        duration: 5000
      });
      loading.present();
      this.resturantServ.serach(this.searchStr)
      .subscribe(async (res) => {
        if(this.checkRes(res)){
          const toast = await this.toastController.create({
            message: res.Errors,
            duration: 2000,
            position: 'middle'
          });
          toast.present();
        }else{
          this.branches = res;
          const navigationExtras: NavigationExtras = {
            queryParams: {
              branches: JSON.stringify(this.branches)
            }
          }
          this.router.navigate(['near-me'],navigationExtras);
        }
        loading.dismiss();
      }, (err:any) => {
        loading.dismiss()
      },() => {});
     }
    
  }

  ionViewWillEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
    navigator['app'].exitApp();
    });
  }

  ionViewDidLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  async logOut(){
    const modal = await this.modalController.create({
      component: LogModPage,
    });
    return await modal.present();
  }

  noFunc(){
    alert("Coming soon!")
  }

  async beforeScan(){
    if(this.platform.is("cordova")){
      const actionSheet = await this.actionSheetController.create({
        header: 'Please select input method',
        cssClass: 'my-custom-class',
        buttons: [{
          text: 'Scan',
          icon: 'qr-code-outline',
          handler: () => {
            this.scan();
          }
        }, {
          text: 'Manual Input',
          icon: 'create-outline',
          handler: () => {
            this.manualInput();
          }
        }]
      });
      await actionSheet.present();
    }else{
      this.manualInput();
    }
  }

  checkRes(res: any){
    if(res.Errors){
      return true;
    }else{
      return false;
    }
  }

  async presentLoading(text){
    const loading = await this.loadingController.create({
      message: 'Fetching meals...',
      duration: 5000
    });
    loading.present();
    this.resturantServ.getResturants(text).subscribe( async (res) => {
      if(this.checkRes(res)){
        const toast = await this.toastController.create({
          message: res.Errors,
          duration: 2000,
          position: 'middle'
        });
        toast.present();
      }else{
        this.resturant = res;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            resturant: JSON.stringify(this.resturant)
          }
        }
        loading.dismiss();
        this.router.navigate(['category'],navigationExtras);
      }
      },async error => {
        const toast = await this.toastController.create({
          message: 'no resturants found',
          duration: 2000,
          position: 'middle'
        });
          toast.present();
          loading.dismiss();
        }, () => {
          loading.dismiss();
        });
  }

  scan(){
    this.barcodeScanner.scan().then((barcodeData) => {
      this.presentLoading(barcodeData.text);
    }).catch(async err => {
      const toast = await this.toastController.create({
        message: 'scan error',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    });
  }

  async manualInput(){
    const alert = await this.alertController.create({
      header: 'Add resturant code',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'add code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (alertData) => {
            this.presentLoading(alertData.code)
          }
        }
      ]
    });
    await alert.present();
  }

  

  nearMe(){
    this.geolocation.getCurrentPosition().then(async (resp) => {
      const loading = await this.loadingController.create({
        message: 'Fetching Resturants near you ...',
        duration: 5000
      });
      loading.present();
      this.resturantServ.getAllResturantsNearMe(String(resp.coords.latitude),String(resp.coords.longitude))
      .subscribe(res => {
        this.branches = res;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            branches: JSON.stringify(this.branches),
          }
        }
        loading.dismiss();
        this.router.navigate(['near-me'],navigationExtras);        
      },(err:any) => {
        loading.dismiss();
        alert("could not get location");
      },() => {
        loading.dismiss();
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
}
