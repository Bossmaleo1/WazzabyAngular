import { Component, OnInit } from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {ConstanceService} from '../Services/Constance.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {NotificationService} from '../Services/notification.service';

@Component({
  selector: 'app-publicconvert-details',
  templateUrl: './publicconvert-details.component.html',
  styleUrls: ['./publicconvert-details.component.scss']
})
export class PublicconvertDetailsComponent implements OnInit {

  id: number;
  name: string;
  updated: string;
  user_photo: string;
  status_photo: string;
  status_text_content: string;
  etat_photo_status: string;
  comments: any;
  libelle_comment = '';
  testevent = 1;
  jaime: number;
  jaimepas: number;
  checkmention: number;
  id_checkmention: number;
  photo: string;
  booljaime: boolean;
  booljaimepas: boolean;
  display_progressbar: boolean = false;
  error_message: string;
  display_error_message: boolean;
  icon: string;
  temp_id_checkmention: number;


  constructor(private publicconvert: PublicConvertServices
    , private route: ActivatedRoute
    , private  router: Router
    , private httpClient: HttpClient
    , private authService: AuthService
    , private _location: Location
    , public snackBar: MatSnackBar
    , private constance: ConstanceService
    , private notificationService: NotificationService
    , private publiccomments: PublicCommentsServices) { }

  ngOnInit() {

    this.display_progressbar = false;
    this.display_error_message = false;
    this.booljaime = false;
    this.booljaimepas = false;
    this.id = this.publiccomments.id;
    this.name = this.publiccomments.name;
    this.updated = this.publiccomments.updated;
    this.user_photo = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.publiccomments.user_photo);
    this.status_photo = this.publiccomments.status_photo;
    this.status_text_content = this.publiccomments.status_text_content;
    this.etat_photo_status = this.publiccomments.etat_photo_status;
    this.jaime = this.publiccomments.jaime;
    this.jaimepas = this.publiccomments.jaimepas;
    this.checkmention = this.publiccomments.checkmention;
    this.id_checkmention = this.publiccomments.id_checkmention;
    const url = this.constance.dns.concat('/api/displayComment?id_messagepublic=').concat(this.publiccomments.id);
    this.connexionToServer2(url);

    if (this.checkmention === 1) {
      this.booljaime = true;
    } else if (this.checkmention === 2) {
      this.booljaimepas = true;
    } else if (this.checkmention === 0) {
      this.booljaime = false;
      this.booljaimepas = false;
    }

    //on marque la notification comme lu
    if (this.publiccomments.notification_marqueur) {
      const urlmarquernotification = this.constance.dns.concat('/api/MarquerNotificationCommeLu?id_notification=')
        .concat(String(this.notificationService.id_notification));
      this.httpClient
        .get(urlmarquernotification)
        .subscribe(
          (response) => {

            return response;
          },
          (error) => {
          }
        );
    }
  }

  onSendComment() {
    this.addComment();
  }


  OnBack() {
    this._location.back();
  }


  connexionToServer(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          return response;
        },
        (error) => {
          this.openSnackBar('Une erreur inconnue vient de se produire suite a votre insertion !', 'erreur');
        }
      );
  }

  connexionToServer2(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response2) => {
          let temp : any;
          temp = response2;
          this.publiccomments.Comments = response2;

          if (this.publiccomments.Comments.length === 0) {
            this.error_message = "Aucun message public";
            this.icon = 'add_comment';
            this.display_error_message = true;
            this.display_progressbar = true;
          } else {
            this.comments = this.publiccomments.Comments;
            this.publiccomments.countcomments = this.comments[0].countcomment;
            this.publiccomments.datecommentitem = this.comments[0].date.date;
            this.publiccomments.libelle = this.comments[0].status_text_content;
            this.publiccomments.date = this.comments[0].date.date;
            this.publiccomments.comment_id = this.comments[0].id;
            /*console.log(this.publiccomments.comment_id);
            console.log(this.publiccomments.libelle);*/
            this.ConnexionCommentItem();
          }
          return response2;
        },
        (error) => {
          this.openSnackBar('Une erreur serveur vient de se produire !', 'erreur');
          this.error_message = "Erreur reseau sur le chargement de message publique";
          this.icon = 'block';
          this.display_error_message = true;
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addComment() {
    let anonymous: any;
    if (this.authService.getSessions().etat === '1') {
      anonymous = 1;
    } else {
      anonymous = 0;
    }
    const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
    let maleosama = new Object();
    maleosama['id'] = 1;
    maleosama['name'] = nom_du_user;
    maleosama['updated'] = "A l'instant";
    maleosama['user_photo'] = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.authService.sessions.photo);
    maleosama['status_text_content'] = this.libelle_comment;
    this.publiccomments.Comments.unshift(maleosama);
    this.comments = this.publiccomments.Comments;
    this.display_error_message = false;
    const url = this.constance.dns.concat('/api/addComment?id_messagepublic=').concat(this.publiccomments.id)
      .concat('&libelle_comment=').concat(this.libelle_comment)
      .concat('&id_user=').concat(this.authService.sessions.id).concat('&anonymous=').concat(anonymous);
    this.libelle_comment = '';
    this.connexionToServer(url);

    if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
      let message;
      if (this.authService.getSessions().etat === '1') {
        message = "Votre message public vient d'etre commenter par un Utilisateur Anonyme";
      } else {
        message = "Votre message public vient d'etre commenter par "
          .concat(this.authService.getSessions().prenom)
          .concat(' ')
          .concat(this.authService.getSessions().nom);
      }
      const url_notification = this.constance.dns.concat('/api/InsertNotification?users_id=')
        .concat(this.authService.sessions.id)
        .concat('&libelle=').concat(message)
        .concat('&id_type=').concat(this.publiccomments.id)
        .concat('&etat=0')
        .concat('&id_recepteur=').concat(String(this.publiccomments.id_recepteur))
        .concat('&anonymous=').concat(anonymous);
      this.recordNotification(url_notification);
      this.ConnexionSendPushNotification();
    }
  }

  Onjaime() {
    let anonymous: any;
    if (this.authService.getSessions().etat === '1') {
      anonymous = 1;
    } else {
      anonymous = 0;
    }
    let message = "Votre message public vient de faire reagir "
      .concat(this.authService.getSessions().prenom)
      .concat(' ')
      .concat(this.authService.getSessions().nom);
    //we build the url of the like mention notification
    const url_notification = this.constance.dns.concat('/api/InsertNotification?users_id=')
      .concat(this.authService.sessions.id)
      .concat('&libelle=').concat(message)
      .concat('&id_type=').concat(this.publiccomments.id)
      .concat('&etat=0')
      .concat('&id_recepteur=').concat(String(this.publiccomments.id_recepteur))
      .concat('&anonymous=').concat(anonymous);
    if (this.checkmention === 1 ) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=0')
        .concat('&id_mention=')
        .concat(String(this.publiccomments.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.jaime--;
      this.publiccomments.checkmention = 0;
    } else if (this.checkmention === 0 && this.id_checkmention != 0) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=1')
        .concat('&id_mention=').concat(String(this.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = true;
      this.booljaimepas = false;
      this.jaime++;
      this.publiccomments.checkmention = 1;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    }  else if (this.id_checkmention === 0 && this.checkmention === 0) {
      const url = this.constance.dns.concat('/api/Mentions?id_user=')
        .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
        .concat('&id_etat=1').concat('&mention=1');
      this.connexionToServer(url);
      this.booljaime = true;
      this.booljaimepas = false;
      this.jaime++;
      this.publiccomments.checkmention = 1;
      this.publiccomments.id_checkmention = this.temp_id_checkmention;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    } else if (this.checkmention === 2) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=1')
        .concat('&id_mention=')
        .concat(String(this.publiccomments.id_checkmention));
      this.connexionToServer(url);
      this.booljaimepas = false;
      this.booljaime = true;
      this.jaime++;
      this.jaimepas--;
      this.publiccomments.checkmention = 1;
      this.publiccomments.id_checkmention = this.temp_id_checkmention;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    }
  }

  Onjaimepas() {
    let anonymous: any;
    if (this.authService.getSessions().etat === '1') {
      anonymous = 1;
    } else {
      anonymous = 0;
    }
    let message = "Votre message public vient de faire reagir "
      .concat(this.authService.getSessions().prenom)
      .concat(' ')
      .concat(this.authService.getSessions().nom);
    //we build the url of the like mention notification
    const url_notification = this.constance.dns.concat('/api/InsertNotification?users_id=')
      .concat(this.authService.sessions.id)
      .concat('&libelle=').concat(message)
      .concat('&id_type=').concat(this.publiccomments.id)
      .concat('&etat=0')
      .concat('id_recepteur=').concat(String(this.publiccomments.id_recepteur))
      .concat('&anonymous=').concat(anonymous);
    if (this.checkmention === 2) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=0')
        .concat('&id_mention=').concat(String(this.publiccomments.id_checkmention));
      this.connexionToServer(url);
      this.booljaimepas = false;
      this.jaimepas--;
      this.publiccomments.checkmention = 0;
    } else if (this.checkmention === 0 && this.id_checkmention != 0) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=2')
        .concat('&id_mention=').concat(String(this.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaimepas++;
      this.publiccomments.checkmention = 2;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    } else if (this.id_checkmention === 0 && this.checkmention === 0) {
      const url = this.constance.dns.concat('/api/Mentions?id_user=')
        .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
        .concat('&id_etat=2').concat('&mention=2');
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaimepas++;
      this.publiccomments.checkmention = 2;
      this.publiccomments.id_checkmention = this.temp_id_checkmention;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    } else if (this.checkmention === 1) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=2')
        .concat('&id_mention=')
        .concat(String(this.publiccomments.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaime--;
      this.jaimepas++;
      this.publiccomments.checkmention = 2;
      this.publiccomments.id_checkmention = this.temp_id_checkmention;
      if (this.publiccomments.id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
      }
    }
  }

  getColor(etat: boolean) {
    if (etat) {
      return '#64B5F6';
    } else {
      return '#757575';
    }
  }

  recordNotification(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          return response;
        },
        (error) => {

        }
      );
  }

  ConnexionCommentItem() {
      const url_displaycommentitem = this.constance.dns
        .concat('/api/displayCommentItem?id_messagepublic=')
        .concat(this.publiccomments.id)
        .concat('&date=').concat(this.publiccomments.datecommentitem)
        .concat('&libelle=').concat(this.publiccomments.libelle).concat('&comment_id=').concat(this.publiccomments.comment_id);

     // console.log(url_displaycommentitem);

    this.httpClient
      .get(url_displaycommentitem)
      .subscribe(
        (response2) => {
          let temp : any;
          let temp_countitem: any;
          temp = response2;
          if(temp.length == 1 ){
              temp_countitem = (this.publiccomments.countcomments - this.comments.length);

              if (temp_countitem >= 1) {

                //console.log(this.publiccomments.datecommentitem);
                this.comments.push(temp[0]);
                this.publiccomments.datecommentitem = temp[0].date.date;
                this.publiccomments.libelle = temp[0].status_text_content;
                this.publiccomments.comment_id = temp[0].id;
                this.ConnexionCommentItem();

                //console.log(this.publiccomments.comment_id);
              }

              if (temp_countitem == 1 || temp_countitem == 0) {
                this.display_progressbar = true;
              }
          } else if (temp.length == 0) {
            this.display_progressbar = true;
          }


          return response2;
        },
        (error) => {
        }
      );

  }


  ConnexionSendPushNotification() {
    let message;
    if (this.authService.getSessions().etat === '1') {
      message = "Votre message public vient d'etre commenter par un Utilisateur Anonyme";
    } else {
      message = "Votre message public vient d'etre commenter par "
        .concat(this.authService.getSessions().prenom)
        .concat(' ')
        .concat(this.authService.getSessions().nom);
    }

    //On construit l'url de la pushnotification
    const url_pushnotification = this.constance.dns1.concat('/Apifcm/apiFCMmessagerie.php?message=').concat(message).concat('&title=Wazzaby')
      .concat('&regId=').concat(this.publiccomments.pushkey_recepteur);
    //on fait appel à la méthode qui envoie la requête HTTP
    this.SendPushNotification(url_pushnotification);
  }


  SendPushNotification(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          return response;
        },
        (error) => {

        }
      );
  }


}
