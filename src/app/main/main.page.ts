import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import anime from 'node_modules/animejs/lib/anime.js';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit{
  private user = {regnum: '', pswrd: '', username:'', contractor:'', messname:''};
  //EVERYTHINGS IS WRT THIS USER, USE CONTEXT OF this.user.regnum for db queries
  public menu: Array<{tag: string, tagico: string, icon: string, val: string, note: string, isChecked: boolean, color: string, price: number}> = [];
  public oldmenu: Array<{tag: string, tagico: string, icon: string, val: string, hasOrdered: boolean, code: string, color: string}> = [];
  public days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  public months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  loading:boolean=true;
  checks = [];
  nullIndices = [];
  disablekey:boolean=false;
  checkChanged:boolean=false;
  deleteRow:boolean=null;
  todayDate:string=null;
  tmrwDate:string=null;

  constructor(private storage: Storage, public alertController: AlertController, private modalController: ModalController) { }

  ngOnInit() {
    this.updateHeader();
    //call func - read from db, modify list size, update list values
    this.updateCode();
    this.updateMenu();
    this.checkTimeUp();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.startAnim();
    }, 1500);
  }

  startAnim(){
    var self=this;
    anime({
      targets: '.itemparent',
      width: '100%',
      duration: 800,
      complete: function() {
        self.loading=false;
      }
    });
  }

  doRefresh(event:any) {
    var self=this;
    this.loading=true;
    anime({
      targets: '.itemparent',
      width: '0%',
      duration: 800,
      complete:function(){
          self.updateCode();
          self.updateMenu();
          self.updateChecks();
          self.checkTimeUp();
          setTimeout(() => {
            event.target.complete();
          }, 1200);
          setTimeout(() => {
          self.startAnim();
        }, 800);
      }
    });
  }

  updateHeader(){
    this.storage.get('reg_num').then(val =>{this.user.regnum=val});
    this.storage.get('pswrd').then(val =>{this.user.pswrd=val});
    this.user.username='Shrihari'; //GET NAME FROM PWI
    this.user.contractor='Leaf & Agro'; //GET CONTRACTOR FROM DB
    this.user.messname='Mega Hostel Mess';
     //Get messname for given regnum
  }

  //**********SERVER MAINTAINS TODAY'S DATE AND TIME OBJ***********
  updateCode(){
    var dateObj = new Date();//get and store today's date
    this.todayDate = this.days[dateObj.getDay()] + '       ' + dateObj.getDate().toString() + ' ' + this.months[dateObj.getMonth()] + ' ' + dateObj.getFullYear().toString();

    //ASSUMING OLDMENU QUERY TAKES BELOW FORM
    var oldmenu = ['Cornflakes with milk',30,null,null,'Veg. Sandwich',40,null,null,'Kadai Paneer',50,null,null];
    //ASSUMING USER BASED QUERY TAKES BELOW FORM
    var codes = ['B3G3K9',null,null,null,'G3GJJ8',null];

    this.oldmenu.splice(0,this.oldmenu.length);
    for (let i = 0; i < oldmenu.length; i+=2) {
      if((i<4)&&(oldmenu[i]!=null)){
        this.oldmenu.push({tag:'tag', tagico: '', icon:'partly-sunny', val:oldmenu[i].toString(), hasOrdered:false, code:codes[i/2], color:'success'});
      }
      else if ((i<8)&&(oldmenu[i]!=null)){
        this.oldmenu.push({tag:'tag2', tagico: '', icon:'sunny', val:oldmenu[i].toString(), hasOrdered:false, code:codes[i/2], color:'primary'});
      }
      else if ((i<12)&&oldmenu[i]!=null){
        this.oldmenu.push({tag:'tag3', tagico: '', icon:'moon', val:oldmenu[i].toString(), hasOrdered:false, code:codes[i/2], color:'danger'});
      }
    }
    this.oldmenu.forEach(item => {
      item.tagico=this.iconDetect(item.val);//run icon detection
      item.hasOrdered=(item.code!=null);
    });
  }

  updateMenu()
  { 
    var dateObj = new Date();//get and store today's date
    dateObj.setDate(dateObj.getDate()+1);
    this.tmrwDate = this.days[dateObj.getDay()] + '       ' + dateObj.getDate().toString() + ' ' + this.months[dateObj.getMonth()] + ' ' + dateObj.getFullYear().toString();

    //ASSUMING MENU QUERY TAKES BELOW FORM
    var menu = ['Dosa',30,null,null,'French Fries',40,null,null,'Noodles',50,'Fried Rice',50];

    this.menu.splice(0,this.menu.length);
    this.nullIndices.splice(0,this.nullIndices.splice.length);
    for (let i = 0; i < menu.length; i+=2) {
      if(i<4){
        if(menu[i]!=null){
          this.menu.push({tag:'tag', tagico: '', icon:'partly-sunny', val:menu[i].toString(), note:'Add:', isChecked:false, color:'success', price:Number(menu[i+1])});
        }
        else{
          this.nullIndices.push(i/2);
        }
      }
      else if (i<8){
        if(menu[i]!=null){
          this.menu.push({tag:'tag2', tagico: '', icon:'sunny', val:menu[i].toString(), note:'Add:', isChecked:false, color:'primary', price:Number(menu[i+1])});
        }
        else{
          this.nullIndices.push(i/2);
        }
      }
      else if (i<12){
        if(menu[i]!=null){
          this.menu.push({tag:'tag3', tagico: '', icon:'moon', val:menu[i].toString(), note:'Add:', isChecked:false, color:'danger', price:Number(menu[i+1])});
        }
        else{
          this.nullIndices.push(i/2);
        }
      }
    }
    this.menu.forEach(item => {
      item.tagico=this.iconDetect(item.val);//run icon detection
    });
  }

  iconDetect(item: string){
    var low_item = item.toLowerCase();
    if(low_item.includes("dosa")||low_item.includes("uthappam")){
      return 'dosa';
    }
    else if(low_item.includes("noodle")){
      return 'noodle';
    }
    else if(low_item.includes("rice")){
      return 'rice';
    }
    else if(low_item.includes("flake")){
      return 'flake';
    }
    else if(low_item.includes("sandwich")){
      return 'sandwich';
    }
    else if(low_item.includes("french")){
      return 'fries';
    }
    else if(low_item.includes("chilly")||low_item.includes("manchurian")||low_item.includes("kadai")){
      return 'chilly';
    }
  }

  toggleChecked(val: string){
    this.checkChanged=true;
    this.menu.forEach(item => {
      if(item.val==val){
        item.isChecked=!item.isChecked;
      }
    });
  }

  updateOrder(){
    this.checkTimeUp();
    if(!this.disablekey&&this.checkChanged){
      this.checks.splice(0,this.checks.length);
      this.deleteRow=true;
        this.menu.forEach(item => {
          if(item.isChecked){
            this.deleteRow=false;
          }
          this.checks.push(item.isChecked);
        });
      this.nullIndices.forEach(element => {
        this.checks.splice(element,0,null);
      });
      this.openModal();
    }
    else if(!this.checkChanged){}
      else{
        this.showTimeout();
    }
  }
  
  async openModal(){
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {checks: this.checks, deleteRow: this.deleteRow},
      backdropDismiss: false
    });
    modal.present();
    await modal.onDidDismiss();
    this.updateChecks();
  }
  
  updateChecks(){
    //GET ROW OF CODES FROM DB
    var codes = [null,null,'B3G3K9',null,null,'G3GJJ8']; //ASSUMING WE GET THIS
    var x = 0;
    this.nullIndices.forEach(element => {
      codes.splice(element-x,1);
      x++;
    });
    var i = 0;
    this.menu.forEach(item => {
      if(codes[i]){
        item.note='Added!';
      }
      else{
        item.note='Add:';
      }
      i++;
    });
    this.checkChanged=false;
  }
  

  checkTimeUp(){//use time obj from server
    var d = new Date();
      if(d.getHours() > 7 && d.getHours() < 23 ){
        this.disablekey=false;
      }
      else{
          this.disablekey=true;
      }
  }

  async showTimeout(){
      const alert = await this.alertController.create({
        header:'Sorry',
        subHeader:'Orders are now Closed',
        message:'Orders can only be made between 7am to 11pm!',
        buttons: ['OK']
      });

      await alert.present();
  }

  async showCode(val: string){
    var code = '';
    this.oldmenu.forEach(item => {
      if(item.val==val){
        code=item.code;
      }
    });
    //show verification code
    const alert = await this.alertController.create({
      header:'Verification Code',
      subHeader:'Show this code to get your meal!',
      message: code,
      buttons: ['OK']
    });

    await alert.present();
  }
}
