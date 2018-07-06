import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ModalController, ToastController } from 'ionic-angular';

/*
  Generated class for the HelpersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HelpersProvider {

  constructor(private alertCtrl:AlertController,
    private toast:ToastController,private modalCtrl:ModalController) {
  }

getCurrentDate(){
  var currentDate = new Date()
var day = currentDate.getDate()
var month = currentDate.getMonth() + 1
var year = currentDate.getFullYear()
let d=  day + "/" + month + "/" + year;
return d;
}
  
  presentToast(msg) {
    let t = this.toast.create({
      message: msg,
      duration:  2300,
      position: 'bottom'
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }


  presentCustomToast(msg, dur,pos) {
    let t = this.toast.create({
      message: msg,
      duration:  dur,
      position: pos
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }


  showAlert(){
   
  }


  
  
  
  presentTopToast(msg) {
    let t = this.toast.create({
      message: msg,
      duration:  1800,
      position: 'top'
    });
  
    t.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    t.present();
  }
  presentConfirm(title,message,successButton, cancelButton, onsuccess,oncancel) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: cancelButton,
          role: 'cancel',
          handler: oncancel
        },
        {
          text: successButton,
          handler:onsuccess
        }
      ]
    });
    alert.present();
  }
  presentPrompt(title,inputs,successButton, cancelButton, onsuccess,oncancel) {
    let alert = this.alertCtrl.create({
      title: title,
      inputs:inputs,
      // inputs: [
      //   {
      //     name: 'username',
      //     placeholder: 'Username'
      //   },
      //   {
      //     name: 'password',
      //     placeholder: 'Password',
      //     type: 'password'
      //   }
      // ],
      buttons: [
        {
          text: cancelButton,
          role: 'cancel',
          handler: oncancel
        },
        {
          text: successButton,
          handler:onsuccess
        }
      ]
    });
    alert.present();
  }
}
