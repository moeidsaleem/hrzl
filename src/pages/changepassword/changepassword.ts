import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { HelpersProvider } from '../../providers/helpers/helpers';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private spinner:SpinnerProvider, private helper:HelpersProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  password='';
  newpassword='';

  changePass(){
    if(this.password == this.newpassword){
      this.spinner.load();


      localStorage.setItem('password', this.password);
      this.navCtrl.pop().then(data=>{
        this.helper.presentToast(`Password Changed!`)
        this.spinner.dismiss();
      }).catch(err=>{
        this.spinner.dismiss();
        console.log(`error in pop`);
        this.helper.presentToast(`error navstack: pop()`);
      })


    }else{
      this.helper.presentToast(`Password donot match.`)
      this.newpassword ='';
    }
  }

}
