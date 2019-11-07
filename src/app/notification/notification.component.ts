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
  notificationslist: any;

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
          if (this.notificationService.notifications.length === 0) {
            this.notificationService.progressbarnotification = false;
            this.error_message = 'Vous avez aucune notification';
            this.display_error_message = true;
            this.openSnackBar(this.error_message,'erreur');
          } else if (this.notificationService.notifications.length > 0) {
            this.notificationslist = this.notificationService.notifications;
            this.notificationService.notificationdate = this.notificationslist[0].date.date;
            this.notificationService.notificationcount = this.notificationslist[0].countnotification;
            this.notificationService.notification_id = this.notificationService.notifications[0].notification_id;
            this.ConnexionItemNotification();
          }
          return response;
        },
        (error) => {
          this.notificationService.progressbarnotification = false;
          this.error_message = 'Vous avez une erreur reseau, veuillez revoir votre connexion internet';
          this.display_error_message = true;
          this.openSnackBar(this.error_message,'erreur');
        });

    //On synchronise les problematique
    this.ConnexionSynchronizationProblematique();
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

  ConnexionItemNotification() {
    const url_lazy_loading = this.constance.dns.concat('/api/displayNotificationItem?id_recepteur=')
      .concat(this.authService.getSessions().id)
      .concat('&date=')
      .concat(this.notificationService.notificationdate)
      .concat('&notification_id=')
      .concat(this.notificationService.notification_id);

    this.httpClient
      .get(url_lazy_loading)
      .subscribe(
        (response1) => {
          let temp: any;
          temp =   response1;

          const tempcountitem = (this.notificationService.notificationcount - this.notificationslist.length);
          if (tempcountitem>= 1) {
            this.notificationslist.push(temp[0]);
            this.notificationService.notificationdate = temp[0].date.date;
            this.notificationService.notification_id = temp[0].notification_id;
            this.ConnexionItemNotification();
          }

          if (tempcountitem == 1) {
            this.notificationService.progressbarnotification = false;
          }

          if (temp.length === 0) {
            this.notificationService.progressbarnotification = false;
          }

          return response1;
        },
        (error) => {
        });

  }

  ConnexionSynchronizationProblematique() {
    const url_synchronization_problematique = this.constance.dns.concat('/api/SynchronizationProblematique?user_id=').concat(String(this.authService.getSessions().id));

    this.httpClient
      .get(url_synchronization_problematique)
      .subscribe(
        (response) => {
          let reponse : any;
          reponse = response;
          if (reponse.problematique_libelle != this.authService.sessions.libelle_prob) {
            //on met les sessions à jour
            this.authService.sessions.libelle_prob = reponse.problematique_libelle;
            this.authService.sessions.id_prob = reponse.problematique_id;

            let dtExpire = new Date();
            dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
            //on met aussi les cookies à jour
            this.authService.setCookie('libelle_prob1', reponse.problematique_libelle, dtExpire, '/', null, null );
            this.authService.setCookie('id_prob1', reponse.problematique_id, dtExpire, '/', null, null );
            //this.problematique_libelle = reponse.problematique_libelle;
          }
          return response;
        },
        (error) => {

        });
  }

}
