import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as papa from 'papaparse';
import {  Http } from '@angular/http';
import { CompleteTestService } from '../../providers/complete-test/complete-test';
import { CompleteLocationService } from '../../providers/complete-location/complete-location';
import { CompleteNearService } from '../../providers/complete-near/complete-near';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    public completeTestService: CompleteTestService,
    private completeLocationService: CompleteLocationService,
    private completeNearService: CompleteNearService,
    private helper:HelpersProvider,
    private spinner:SpinnerProvider,
    private camera:Camera,
    private androidPermissions: AndroidPermissions,
    private http:Http

    //private toast: Toast
  ) {}
errx;

  ionViewDidLoad(){
    this.getBrands();
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
    ).catch(err=>{
      console.log('CORDOVA PLUGIN CALLED! ANDROID PERMISSION GRANT')
    })
  }
/* 
  data=>
    ---- itemId
    ---- date
    ---- category
    ---- brand
    ---- location
    ---- nearby
    ---- img1
    ---- img2
    ---- img3
    ---- size
    ---- type
*/
  data = { date:"", category:"", brand:"", location:"",nearby:"",img1:"",img2:"",img3:"",size:"", type:"" };

  img1='';
  img2='';
  img3='';

  brands;
  


  getBrands(){
    return this.http.get('./assets/data/brands.json').map(res=> res.json())
    .subscribe(resp=>{
      console.log(resp);
      this.brands = resp;

    })
  }

  takePhoto(imgVal:Number, e){
    e.preventDefault();
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType:this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum:true
    }
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
    //  let base64Image = 'data:image/jpeg;base64,' + imageData; /* image file */
     if(imgVal == 1){
       this.data.img1 = 'data:image/jpeg;base64,' + imageData;
     }else if(imgVal == 2){
       this.data.img2 = 'data:image/jpeg;base64,' + imageData;
     }else if(imgVal == 3){
       this.data.img3 = 'data:image/jpeg;base64,' + imageData;;
     }
    }, (err) => {
     // Handle error
     this.helper.presentToast(err);
    }).catch(error=>{
      this.helper.presentToast(error);

    })
  }




  emptyData(){
    this.data = { date:"", category:"", brand:"", location:"",nearby:"",img1:'',img2:'',img3:"",size:"", type:"" };
    this.dummyBrand ='';


  }



  showAlert(){
    this.helper.presentConfirm('Save Data','Are you sure you want to save confirm the data?','Save','Cancel',()=>{
      //success
      this.saveData();

    }, ()=>{
      //cancel

    })
  }



  dummyBrand;

  checkBrand(value){
    this.dummyBrand=value;

    
  }
  saveData() {
    if(this.data.brand == null || this.data.brand == ''){
      this.data.brand = this.dummyBrand;
    }
    
    console.log(this.data);
    this.spinner.load();
    this.data.date = this.helper.getCurrentDate();     
    this.sqlite.create({
      name: 'itemss.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // db.executeSql('INSERT INTO items(date) VALUES(?)',[this.data.date])
      db.executeSql('INSERT INTO items(date,category,brand,location,nearby,img1,img2,img3,size,type) VALUES(?,?,?,?,?,?,?,?,?,?)',[this.data.date,this.data.category,this.data.brand,this.data.location,this.data.nearby,this.data.img1,this.data.img2,this.data.img3,this.data.size,this.data.type])
        .then(res => {
          console.log(res);
          this.spinner.dismiss();
          this.helper.presentToast(`Data Saved`);
          this.navCtrl.pop().then(d=>{
          },err=>{
            this.helper.presentToast(`Error in pop out`)
          })
        })
        .catch(e => {
          console.log(e);
          this.errx =e;
          this.spinner.dismiss();
          this.helper.presentCustomToast(`Error in adding data.`,5000,' center');
          this.navCtrl.pop()
        });
    }).catch(e => {
      console.log(e);
      this.spinner.dismiss();
      this.helper.presentCustomToast(`Error connecting to db`, 5000, 'center')
      this.navCtrl.pop();
    });
  }



  csvData: any[] = [];
  headerRow: any[] = [];

  private readCsvData() {
    this.http.get('assets/dummyData.csv')
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;
 
    this.headerRow = parsedData[0];
 
    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }


  private handleError(err) {
    console.log('something went wrong: ', err);
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }

  portChange(e){
    console.log(`e happend`)
  }

}