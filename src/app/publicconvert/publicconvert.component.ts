import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PublicConvertServices} from '../Services/public.convert.services';
import {ConstanceService} from '../Services/Constance.service';
import {Router} from '@angular/router';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../Services/auth.service';
import {DeleteMessagepublicService} from '../Services/delete.messagepublic.service';
import {UtilService} from '../Services/util.service';
import {UpdateService} from '../Services/update.service';

@Component({
  selector: 'app-publicconvert',
  templateUrl: './publicconvert.component.html',
  styleUrls: ['./publicconvert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublicconvertComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() updated: string;
  @Input() user_photo: string;
  @Input() status_text_content: string;
  @Input() etat_photo: string;
  @Input() etat_photo_status: string;
  @Input() status_photo: string;
  @Input() countcomment: string;
  @Input() indexOfConvert: number;
  @Input() jaime: number;
  @Input() jaimepas: number;
  @Input() checkmention: number;
  @Input() id_checkmention: number;
  @Input() visibility: boolean;
  @Input() user_id: number;
  photo: string;
  booljaime: boolean;
  booljaimepas: boolean;
  temp_id_checkmention: number;
  test_user_root: boolean;
  response_object: {};

  //this.publicconvertservice.conversationsPublics
  constructor(private publicconvert: PublicConvertServices
    , private constance: ConstanceService
    , private updateservice: UpdateService
    , private publiccommentsservice: PublicCommentsServices
    , private authService: AuthService
    , public snackBar: MatSnackBar
    , public deletemessgepublocservice: DeleteMessagepublicService
    , private httpClient: HttpClient
    , private utilservice: UtilService
    , private  router: Router) {

  }

  ngOnInit() {
    this.photo = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.user_photo);
    this.booljaime = false;
    this.booljaimepas = false;
    if (this.checkmention === 1) {
      this.booljaime = true;
    } else if (this.checkmention === 2) {
      this.booljaimepas = true;
    } else if (this.checkmention === 0) {
      this.booljaime = false;
      this.booljaimepas = false;
    }

    //we test if user can update and delete the message
    if (this.authService.getSessions().id == this.user_id) {
      this.test_user_root = true;
    } else {
      this.test_user_root = false;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  OnLaunchIntervention() {
    this.publiccommentsservice.id = this.id;
    this.publiccommentsservice.name = this.name;
    this.publiccommentsservice.updated = this.updated;
    this.publiccommentsservice.user_photo = this.user_photo;
    this.publiccommentsservice.status_photo = this.status_photo;
    this.publiccommentsservice.status_text_content = this.status_text_content;
    this.publiccommentsservice.etat_photo_status = this.etat_photo_status;
    this.publiccommentsservice.indexOfConvert = this.indexOfConvert;
    this.publiccommentsservice.checkmention = this.checkmention;
    this.publiccommentsservice.id_checkmention = this.id_checkmention;
    this.publiccommentsservice.jaime = this.jaime;
    this.publiccommentsservice.jaimepas = this.jaimepas;
    this.publiccommentsservice.id_recepteur = this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur;
    this.router.navigate(['public-convert-details']);
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
      .concat('&id_type=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].id)
      .concat('&etat=0')
      .concat('&id_recepteur=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur)
      .concat('&anonymous=').concat(anonymous);
    const pushnotification_url = this.constance.dns1.concat('/Apifcm/apiFCMmessagerie.php?message=').concat(message).concat('&title=Wazzaby')
      .concat('&regId=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].pushkey_recepteur);
    if (this.checkmention === 1 ) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=0')
        .concat('&id_mention=')
        .concat(String(this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.jaime--;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 0;
    } else if (this.checkmention === 0 && this.id_checkmention != 0) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=1')
        .concat('&id_mention=').concat(String(this.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = true;
      this.booljaimepas = false;
      this.jaime++;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 1;
      if (this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
        this.recordNotification(pushnotification_url);
      }
    } else if (this.id_checkmention === 0 && this.checkmention === 0) {
      const url = this.constance.dns.concat('/api/Mentions?id_user=')
        .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
        .concat('&id_etat=1').concat('&mention=1');
      this.connexionToServer(url);
      this.booljaime = true;
      this.booljaimepas = false;
      this.jaime++;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 1;
      this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention = this.temp_id_checkmention;
      if (this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
        this.recordNotification(pushnotification_url);
      }
    } else if (this.checkmention === 2) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=1')
        .concat('&id_mention=')
        .concat(String(this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention));
      this.connexionToServer(url);
      this.booljaimepas = false;
      this.booljaime = true;
      this.jaime++;
      this.jaimepas--;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 1;
      this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention = this.temp_id_checkmention;
      if (this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
        this.recordNotification(pushnotification_url);
      }
    }
  }

  Onjaimepas() {
    let message = "Votre message public vient de faire reagir "
      .concat(this.authService.getSessions().prenom)
      .concat(' ')
      .concat(this.authService.getSessions().nom);
    let anonymous: any;
    if (this.authService.getSessions().etat === '1') {
      anonymous = 1;
    } else {
      anonymous = 0;
    }
    //we build the url of the like mention notification
    const url_notification = this.constance.dns.concat('/api/InsertNotification?users_id=')
      .concat(this.authService.sessions.id)
      .concat('&libelle=').concat(message)
      .concat('&id_type=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].id)
      .concat('&etat=0')
      .concat('id_recepteur=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur)
      .concat('&anonymous=').concat(anonymous);

    const pushnotification_url = this.constance.dns1.concat('/Apifcm/apiFCMmessagerie.php?message=').concat(message).concat('&title=Wazzaby')
      .concat('&regId=').concat(this.publicconvert.conversationsPublics[this.indexOfConvert].pushkey_recepteur);
    if (this.checkmention === 2) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=0')
        .concat('&id_mention=').concat(String(this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention));
      this.connexionToServer(url);
      this.booljaimepas = false;
      this.jaimepas--;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 0;
    } else if (this.checkmention === 0 && this.id_checkmention != 0) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=2')
        .concat('&id_mention=').concat(String(this.id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaimepas++;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 2;
      if (this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
        this.recordNotification(pushnotification_url);
      }
    } else if (this.id_checkmention === 0 && this.checkmention === 0) {
      const url = this.constance.dns.concat('/api/Mentions?id_user=')
        .concat(this.authService.sessions.id).concat('&id_libelle=').concat(String(this.id))
        .concat('&id_etat=2').concat('&mention=2');
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaimepas++;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 2;
      this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention = this.temp_id_checkmention;
      this.recordNotification(url_notification);
      this.recordNotification(pushnotification_url);
    } else if (this.checkmention === 1) {
      const url = this.constance.dns.concat('/api/MentionsUpdate?id_etat=2')
        .concat('&id_mention=')
        .concat(String(this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention));
      this.connexionToServer(url);
      this.booljaime = false;
      this.booljaimepas = true;
      this.jaime--;
      this.jaimepas++;
      this.publicconvert.conversationsPublics[this.indexOfConvert].checkmention = 2;
      this.publicconvert.conversationsPublics[this.indexOfConvert].id_checkmention = this.temp_id_checkmention;
      if (this.publicconvert.conversationsPublics[this.indexOfConvert].id_recepteur != this.authService.getSessions().id) {
        this.recordNotification(url_notification);
        this.recordNotification(pushnotification_url);
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

  connexionToServer(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.publicconvert.public_response = response;
          this.temp_id_checkmention = this.publicconvert.public_response.id_mention;
          return response;
        },
        (error) => {
          this.openSnackBar("Une erreur serveur vient de se produire", "erreur");
        }
      );
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

  //this function display a delete confirm dialog
  displaydeleteDialog() {
    this.deletemessgepublocservice.displaydialog = 'block';
    this.deletemessgepublocservice.id_message_public = this.publicconvert.conversationsPublics[this.indexOfConvert].id;
    this.deletemessgepublocservice.indexOf = this.indexOfConvert;
    this.deletemessgepublocservice.etat_photo_status = this.publicconvert.conversationsPublics[this.indexOfConvert].etat_photo_status;
    this.deletemessgepublocservice.count = this.publicconvert.conversationsPublics[this.indexOfConvert].countcomment;
    if (this.publicconvert.conversationsPublics[this.indexOfConvert].etat_photo_status === 'block') {
      this.deletemessgepublocservice.id_photo = this.publicconvert.conversationsPublics[this.indexOfConvert].id_photo;
      //on met le split car on veux juste recuperer le nom du fichier plus extension
      this.deletemessgepublocservice.photo_message_public = this.publicconvert.conversationsPublics[this.indexOfConvert].status_photo.split('/')[5];
    }
  }

  displayupdateDialog() {
    this.updateservice.block_boite_de_dialogue = 'block';
    this.updateservice.dialog_update_or_display = false;
    this.updateservice.libellemessagepublic = this.publicconvert.conversationsPublics[this.indexOfConvert].status_text_content;
    this.updateservice.id_message_public = this.publicconvert.conversationsPublics[this.indexOfConvert].id;
    this.updateservice.indexOf = this.indexOfConvert;
    if (this.publicconvert.conversationsPublics[this.indexOfConvert].etat_photo_status === 'block') {
      this.updateservice.disparaitreimage = 'block';
      this.updateservice.imageSrc = this.publicconvert.conversationsPublics[this.indexOfConvert].status_photo;
      this.updateservice.id_photo = this.publicconvert.conversationsPublics[this.indexOfConvert].id_photo;
      this.updateservice.imagenamefordelete = this.publicconvert.conversationsPublics[this.indexOfConvert].status_photo.split('/')[5];
    }
    this.updateservice.libelle_photo = 'MODIFIER';
  }



}
