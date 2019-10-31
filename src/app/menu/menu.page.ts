import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  date:string = null;

  constructor(private networkService: NetworkService, private storage: Storage, private photoViewer: PhotoViewer) { }

  ngOnInit() {
    this.storage.set('navIfNetwork','menu');
    this.networkService.checkDisconnection();
    //rcv img and date
    //or just host img and paste img url
    //store image in ../../assets/images/menu.jpeg
    this.date='09/10/2019';
  }

  showImage(){ //untested
    this.photoViewer.show('../../assets/images/menu.jpeg');
  }

  ngOnDestroy(){
    this.networkService.disconnectDisconnectSubscription();
  }

}
