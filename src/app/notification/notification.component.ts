import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {NotificationService} from '../Services/notification.service';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  error_message: string;
  display_error_message: boolean = false;

  constructor(private  router: Router
    , public snackBar: MatSnackBar
    , private authService: AuthService
    , private notificationService: NotificationService
    , private constance: ConstanceService
    , private httpClient: HttpClient) { }

  ngOnInit() {

    this.notificationService.progressbarnotification = true;
    this.display_error_message = false;
    const url = this.constance.dns
      .concat('/api/displayNotification?id_recepteur=')
      .concat(this.authService.getSessions().id);
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.notificationService.notifications = response;
          this.notificationService.progressbarnotification = false;
          if (this.notificationService.notifications.length === 0) {
            this.error_message = 'Vous avez aucune notification';
            this.display_error_message = true;
            this.openSnackBar(this.error_message,'erreur');
          }
          return response;
        },
        (error) => {
          this.notificationService.progressbarnotification = false;
          this.error_message = 'Vous avez une erreur reseau, veuillez revoir votre connexion internet';
          this.display_error_message = true;
          this.openSnackBar(this.error_message,'erreur');
        });
  }

  OnBack() {
    this.router.navigate(['home']);
  }


  Reactualise() {
    this.notificationService.progressbarnotification = true;
    this.display_error_message = false;
    const url = this.constance.dns
      .concat('/api/displayNotification?id_recepteur=')
      .concat(this.authService.getSessions().id);
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.notificationService.notifications = response;
          this.notificationService.progressbarnotification = false;
          if (this.notificationService.notifications.length === 0) {
            this.error_message = 'Vous avez aucune notification';
            this.display_error_message = true;
            this.openSnackBar(this.error_message,'erreur');
          }
          return response;
        },
        (error) => {
          this.notificationService.progressbarnotification = false;
          this.error_message = 'Vous avez une erreur reseau, veuillez revoir votre connexion internet';
          this.display_error_message = true;
          this.openSnackBar(this.error_message,'erreur');
        });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
