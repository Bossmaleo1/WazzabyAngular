import {Component, Input, OnInit} from '@angular/core';
import {PublicCommentsServices} from '../Services/public.comments.services';
import {NotificationService} from '../Services/notification.service';
import {Router} from '@angular/router';
import {ConstanceService} from '../Services/Constance.service';
import {AuthService} from '../Services/auth.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() index: number;
  @Input() nom: string;
  @Input() prenom: string;
  @Input() photo: string;
  @Input() libelle: string;
  @Input() updated: string;
  @Input() id_type: string;
  @Input() id_libelle: number;
  @Input() notification_id: number;
  @Input() expediteur_id: string;
  @Input() etat: string;
  @Input() hide_done_icon: boolean = false;

  constructor(private publiccomments: PublicCommentsServices
    , private  router: Router
    ,private authService: AuthService
    , private constance: ConstanceService
    , private notificationService: NotificationService) { }

  ngOnInit() {

    //on test si l'utilisateur n'a pas de photo de profil
    if (this.photo == this.constance.dns1.concat('/uploads/photo_de_profil/')) {
      this.photo = this.constance.dns1.concat('/uploads/photo_de_profil/ic_profile_colorier.png');
    }

    if (this.etat == '1') {
      this.hide_done_icon = true;
    } else {
      this.hide_done_icon = false;
    }

    //on test si le mode dark est activé ou pas
    if (String(this.authService.getCookie('darkmode1')) == '0') {
      this.constance.primary_color = '#448AFF';
      this.constance.backgroundcolor = '#F5F5F5';
      this.constance.cardview_textcolor = '##212121';
    } else if (String(this.authService.getCookie('darkmode1')) == '1') {
      this.constance.primary_color = '#424242';
      this.constance.backgroundcolor = '#212121';
      this.constance.cardview_textcolor = '#FFFFFF';
      this.constance.cardview_background = '#424242';
    }
  }

  RootTo() {
    this.publiccomments.id = this.notificationService.notifications[this.index].id_messagepublic;
    if (this.prenom == 'Utilisateur' && this.nom =='Anonyme') {
      this.publiccomments.name = "Utilisateur Anonyme "+ this.authService.getSessions().id;
      this.publiccomments.user_photo = 'ic_profile_anonymous.png';
    } else {
      this.publiccomments.name = this.notificationService.notifications[this.index].name_messagepublic;
      this.publiccomments.user_photo = this.notificationService.notifications[this.index].user_photo_messagepublic;
    }

    this.publiccomments.updated = this.notificationService.notifications[this.index].updated_messagepublic;
    this.publiccomments.status_photo = this.notificationService.notifications[this.index].status_photo_messagepublic;
    this.publiccomments.status_text_content = this.notificationService.notifications[this.index].status_text_content_messagepublic;
    this.publiccomments.etat_photo_status = this.notificationService.notifications[this.index].etat_photo_status_messagepublic;
    this.publiccomments.checkmention = this.notificationService.notifications[this.index].checkmention;
    this.publiccomments.id_checkmention = this.notificationService.notifications[this.index].id_checkmention;
    this.publiccomments.indexOfConvert = this.index;
    this.publiccomments.jaime = this.notificationService.notifications[this.index].countjaime;
    this.publiccomments.jaimepas = this.notificationService.notifications[this.index].countjaimepas;
    this.publiccomments.notification_marqueur = true;
    this.publiccomments.id_recepteur = this.notificationService.notifications[this.index].expediteur_id;
    this.notificationService.id_notification = this.notificationService.notifications[this.index].notification_id;
    this.router.navigate(['public-convert-details']);
  }

}
