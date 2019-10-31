import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController} from '@ionic/angular';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/main',
      icon: 'home',
      direction: 'root'
    },
    {
      title: 'General Menu',
      url: '/menu',
      icon: 'menu',
      direction: 'forward'
    },
    {
      title: 'History',
      url: '/history',
      icon: 'time',
      direction: 'forward'
    },
    {
      title: 'Holiday',
      url: '/holiday',
      icon: 'hand',
      direction: 'forward'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
      direction: 'forward'
    },
    {
      title: 'Log Out',
      url: '/home',
      icon: 'power',
      direction: 'root'
    }
  ];

  showSplash:boolean=true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#c78100');
      this.splashScreen.hide();
      this.storage.get('navIfNetwork').then(page=>{
        if(page!=''){
          this.navCtrl.navigateRoot(page);
        }
      })
      setTimeout(() => {
        this.showSplash=false;
      }, 3000);
    });
  }

  checkLogout(title:string){
    if(title=='Log Out'){
      this.storage.set('navIfNetwork','');
    }
  }
}
