import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//native
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';

import { FilterPipeModule } from 'ngx-filter-pipe';

//extras
// import { SelectSearchableModule } from 'ionic-select-searchable';
import { AutoCompleteModule } from 'ionic2-auto-complete';



import { SpinnerProvider } from '../providers/spinner/spinner';
import { HelpersProvider } from '../providers/helpers/helpers';
import { CompleteTestService } from '../providers/complete-test/complete-test';
import { AddPage } from '../pages/add/add';
import { CompleteLocationService } from '../providers/complete-location/complete-location';
import { CompleteNearService } from '../providers/complete-near/complete-near';
import { ExcelProvider } from '../providers/excel/excel';
import { GroupByPipe } from '../pipes/group-by/group-by';
import { InputMask } from '../directives/input-mask/input-mask';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddPage,
    GroupByPipe,
    InputMask
  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
   // SelectSearchableModule,
    AutoCompleteModule,
    FilterPipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Camera,
    File,
    AndroidPermissions,
    SpinnerProvider,
    HelpersProvider,
    CompleteTestService,
    CompleteNearService,
    CompleteLocationService,
    ExcelProvider,
    
  ],
})
export class AppModule {}
