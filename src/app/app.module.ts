import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { AddProfilPictureComponent } from './add-profil-picture/add-profil-picture.component';
import { CommentsComponent } from './comments/comments.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { DownloadAndroidComponent } from './download-android/download-android.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { InscriptFormComponent } from './inscript-form/inscript-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationComponent } from './notification/notification.component';
import { PrivateUserOnlineComponent } from './private-user-online/private-user-online.component';
import { PrivaterecentconvertComponent } from './privaterecentconvert/privaterecentconvert.component';
import { ProblematiqueDetailsComponent } from './problematique-details/problematique-details.component';
import { ProblematiqueGeneraleComponent } from './problematique-generale/problematique-generale.component';
import { ProblematiqueItemComponent } from './problematique-item/problematique-item.component';
import { ProfilComponent } from './profil/profil.component';
import { PublicconvertComponent } from './publicconvert/publicconvert.component';
import { PublicconvertDetailsComponent } from './publicconvert-details/publicconvert-details.component';
import { SettingsComponent } from './settings/settings.component';
import { WelcomeToWazzabyComponent } from './welcome-to-wazzaby/welcome-to-wazzaby.component';
import {AuthGuardService} from './Services/auth.guard.service';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {AuthService} from './Services/auth.service';
import {ConstanceService} from './Services/Constance.service';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import { LyThemeModule, LY_THEME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import {ProblematiqueItemService} from './Services/problematique.item.service';
import {UpdateService} from './Services/update.service';
import {UtilService} from './Services/util.service';
import {DeleteMessagepublicService} from './Services/delete.messagepublic.service';
import {MessagepublicService} from './Services/messagepublic.service';
import {PrivateRecentconvertServices} from './Services/private.recentconvert.services';
import {AddProfilPictureService} from './Services/add.profil.picture.service';
import {PrivateUseronlineServices} from './Services/private.useronline.services';
import {PublicCommentsServices} from './Services/public.comments.services';
import {Help1Services} from './Services/help1.services';
import {PublicConvertServices} from './Services/public.convert.services';
import {HomeDesignService} from './Services/home.design.service';
import {NotificationService} from './Services/notification.service';
import {LyIconModule} from '@alyle/ui/icon';
import {LyTypographyModule} from '@alyle/ui/typography';
import {LyButtonModule} from '@alyle/ui/button';
import {LyResizingCroppingImageModule} from '@alyle/ui/resizing-cropping-images';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
// tslint:disable-next-line:import-spacing
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';

const appRoutes: Routes = [
  {path: 'about', component: AboutComponent},
  {path: 'settings', canActivate: [AuthGuardService], component: SettingsComponent},
  {path: 'profil', canActivate: [AuthGuardService], component: ProfilComponent},
  {path: 'problematique', canActivate: [AuthGuardService], component: ProblematiqueGeneraleComponent},
  {path: 'details', canActivate: [AuthGuardService], component: ProblematiqueDetailsComponent},
  {path: 'notification', canActivate: [AuthGuardService], component: NotificationComponent},
  {path: 'download', component: DownloadAndroidComponent},
  {path: 'home', canActivate: [AuthGuardService], component: HomeComponent},
  {path: 'public-convert-details', canActivate: [AuthGuardService], component: PublicconvertDetailsComponent},
  {path: 'inscript', component: InscriptFormComponent},
  {path: 'connexion', component: ConnexionComponent},
  {path: 'welcome', canActivate: [AuthGuardService], component: WelcomeToWazzabyComponent},
  {path: 'history', canActivate: [AuthGuardService], component: HistoryComponent},
  {path: '', component: ConnexionComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    AddProfilPictureComponent,
    CommentsComponent,
    ConnexionComponent,
    DownloadAndroidComponent,
    HistoryComponent,
    HomeComponent,
    InscriptFormComponent,
    NotFoundComponent,
    NotificationItemComponent,
    NotificationComponent,
    PrivateUserOnlineComponent,
    PrivaterecentconvertComponent,
    ProblematiqueDetailsComponent,
    ProblematiqueGeneraleComponent,
    ProblematiqueItemComponent,
    ProfilComponent,
    PublicconvertComponent,
    PublicconvertDetailsComponent,
    SettingsComponent,
    WelcomeToWazzabyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LyThemeModule.setTheme('minima-dark'),
    LyResizingCroppingImageModule,
    LyButtonModule,
    LyIconModule,
    LyTypographyModule,
    FlexLayoutModule,
    PickerModule,
    NgxEmojiPickerModule.forRoot()
  ],
  providers: [
    AuthService,
    HomeDesignService,
    PublicConvertServices,
    AuthGuardService,
    Help1Services,
    PublicCommentsServices,
    PrivateUseronlineServices,
    PrivateRecentconvertServices,
    ConstanceService,
    MessagepublicService,
    ProblematiqueItemService,
    DeleteMessagepublicService,
    UtilService,
    UpdateService,
    AddProfilPictureService,
    NotificationService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
