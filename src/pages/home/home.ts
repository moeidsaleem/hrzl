import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HelpersProvider } from '../../providers/helpers/helpers';
import { SpinnerProvider } from '../../providers/spinner/spinner';
import { CompleteTestService } from '../../providers/complete-test/complete-test';
import { AddPage } from '../add/add';
import { ExcelProvider } from '../../providers/excel/excel';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file';
import { FilterPipe } from 'ngx-filter-pipe';
type AOA = any[][];


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private sqlite: SQLite,
    public completeTestService: CompleteTestService,
    private helper:HelpersProvider,
    public file: File
    ,private filterPipe: FilterPipe,
    private excelService: ExcelProvider,
    private spinner:SpinnerProvider) {
    


  }



  // data: any[][] = [[1,2,3],[2,3,4]];


data;

  read(bstr: string) {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
  };

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
  write(): XLSX.WorkBook {
    /* generate worksheet */
    // let data=this.items.map(x=>{
    //   let id=x.itemId;
    //   let date=x.date;
    //   let category=x.category;
    //   let brand=x.brand;
    //   let location=x.location;
    //   let nearby=x.nearby;
    //   let size=x.size;
    //   let type=x.type;
    // });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.items);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '0');

    return wb;
    
  };

  /* File Input element for browser */  
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.read(bstr);
    };
    reader.readAsBinaryString(target.files[0]);
  };

  /* Export button */
  async export() {
    if(this.items.length>0){
    //for file name
    const wb: XLSX.WorkBook = this.write();
    let rand = Math.floor((Math.random() * 1000) + 1);
    const filename: string = "ionicsheet2a"+rand.toString()+".xlsx";
    try {
      /* generate Blob */
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob: Blob = new Blob([wbout], {type: 'application/octet-stream'});

      /* find appropriate path for mobile */
      const target: string = this.file.documentsDirectory || this.file.externalDataDirectory || this.file.dataDirectory || '';
      const dentry = await this.file.resolveDirectoryUrl(target);
      const url: string = dentry.nativeURL || '';

      /* attempt to save blob to file */
      await this.file.writeFile(url, filename, blob, {replace: true});
      alert(`Export Complete! Wrote to SheetJSIonic.xlsx in ${url}`);
    } catch(e) {
      if(e.message.match(/It was determined/)) {
        /* in the browser, use writeFile */
        XLSX.writeFile(wb, filename);
      }
      else alert(`Error: ${e.message}`);
    }


  }else if(this.items.length<=0){
    this.helper.presentToast(`Please add atleast one item to Export!`)
  }
  };



  // export(){
  //   let data = [ 
  //     {id:0, category:'gaming',brand:'Ubi Soft', img1:'',img2:'',img3:'',type:'PF', size:'JPG'},
  //     {id:1, category:'books',brand:'Neo Soft', img1:'',img2:'',img3:'',type:'AF', size:'JPG'},
  //     {id:2, category:'restaurants',brand:'Romanda', img1:'',img2:'',img3:'',type:'LF', size:'PG'}
  //   ]
  //   this.excelService.exportAsExcelFile(data, 'games');
  // }

  ionViewDidEnter(){
    this.getData();
  }

  detailPage(itemId){
    this.navCtrl.push('DetailsPage', itemId);
  }

addPage(){
   this.navCtrl.push(AddPage);
}


items:Array<any>=[];
itemx;
balance;
totalIncome;
totalExpense;


remove(id){
  this.helper.presentConfirm('Remove Item','Are you sure you want to delete this?','Remove','Cancel',()=>{
    //remove
    this.removeItem(id);
  }, ()=>{
    //cancel
  })
}

removeItem(id){
  this.spinner.load();
  this.sqlite.create({
    name: 'itemss.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM items WHERE itemId=?', [id])
    .then(res => {
     this.spinner.dismiss();
     this.helper.presentToast(`Item removed`);
     this.getData();
    })
    .catch(e => {
      this.spinner.dismiss();
      this.helper.presentToast(`Error Removing data  `)
    });
   }).catch(e =>{
          this.spinner.dismiss();
           console.log(e);
    this.helper.presentToast(`Error" `);

  });

  

}


exportItems;
  getData() {
    // this.helper.presentTopToast(`Creating Db....`)
    this.sqlite.create({
      name: 'itemss.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`CREATE TABLE IF NOT EXISTS items(itemId INTEGER PRIMARY KEY, date TEXT, category TEXT, brand TEXT, location TEXT, nearby TEXT, img1 TEXT, img2 TEXT, img3 TEXT, size TEXT, type TEXT)`, {})
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));


      db.executeSql('SELECT * FROM items', {})
      .then(res => {
        this.itemx = [];
        // this.helper.presentTopToast(`Row length is: ${res.rows.length}`)
        for(var i=0; i<res.rows.length; i++) {
          this.itemx.push({
            itemId:res.rows.item(i).itemId,
            date:res.rows.item(i).date,
            category:res.rows.item(i).category,
            brand:res.rows.item(i).brand,
            location:res.rows.item(i).location,
            nearby:res.rows.item(i).nearby,
            img1:res.rows.item(i).img1,
            img2:res.rows.item(i).img2,
            img3:res.rows.item(i).img3,
            size:res.rows.item(i).size,
            type:res.rows.item(i).type
          });
          
        }
        setTimeout(()=>{
          this.items = this.itemx;
        
        },1000)
        
      })
      .catch(e => {
        this.helper.presentToast(`Error fetching data  `)
      });

     }).catch(e =>{
        console.log(e);
      this.helper.presentToast(`Error creating table`)
    });
  }


  
  userFilter = {brand:''};
  terms:any ='';
  searchTerm: string = '';


  temp;

  // listx=[
  //   {brand:'aaa', category:'love',location:'town', nearby:'masjid',itemId:2, type:'aa',date:'6/7/18'},
  //   {brand:'bbb', category:'love',location:'town', nearby:'masjid',itemId:2, type:'aa',date:'5/7/18'},
  //   {brand:'bbb', category:'love',location:'town', nearby:'masjid',itemId:2, type:'aa',date:'5/7/18'},
  //   {brand:'dolice', category:'love',location:'town', nearby:'masjid',itemId:2, type:'aa',date:'3/9/17'},
  // ]
  // getItems(ev) {
  //   // Reset items back to all of the items
  //   this.listx =this.temp;

  //   // set val to the value of the ev target
  //   var val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.listx = this.listx.filter((item) => {
  //       return (item.brand.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }


  //export()


  promptPass(){
    let pass = localStorage.getItem('password');
    if(pass){
    this.helper.presentPrompt('Admin Pass',
      [
        {
          name: 'password',
          placeholder: 'Admin Password'
        }
      ],'Verify','Cancel',(data)=>{
        //Verify
        if(data.password == localStorage.getItem('password')){
            this.export();

           

        }else{
          this.helper.presentToast(`Wrong Password`);
        }
       
      }, (data)=>{
        //cancel

      });

    }else{
      this.helper.presentToast(`Please create a password in order to export.`);
      this.goPassChange()

    }
  }



  goPassChange(){
    this.navCtrl.push('ChangepasswordPage');
  }
  goSettings(){
   this.navCtrl.push('SettingsPage');
  }

}
