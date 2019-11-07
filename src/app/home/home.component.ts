import {Component, ElementRef, Inject, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {HomeDesignService} from '../Services/home.design.service';
import {MatSlideToggleChange, MatSnackBar, MatTabChangeEvent} from '@angular/material';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import {HttpClient} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {MessagePublic} from '../models/MessagePublic.model';
import {Subscription} from 'rxjs';
import {MessagepublicService} from '../Services/messagepublic.service';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import {PublicConvertServices} from '../Services/public.convert.services';
import {DeleteMessagepublicService} from '../Services/delete.messagepublic.service';
import {UtilService} from '../Services/util.service';
import {UpdateService} from '../Services/update.service';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {


  fabTogglerState = 'inactive';

  messagepublic: MessagePublic;
  messagepublicsubscription: Subscription;

  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;


  IconEtatColorPublicConver = true;
  IconEtatColorPrivateConver = false;

  /*la variable qui hidden le badges*/
  badgeshidden = false;
  badgetaille: any;
  /*les variables pour la gestion des badges pour les messages public*/
  badgehidden_public_message: false;
  badgetaille_public_message: any;
  /*le tableau contenant les conversations des utilisateurs*/
  conversationsPublicsHome: any;
  privateusersOnlineHome: any;
  privaterecentConvertHome: any;

  animal: string;
  name: string;
  afficher_spinner = false;

  // les coordonnees de l'utilisateurs
  nom: string;
  prenom: string;
  photo_user: string;
  problematique_libelle: string;
  // attributs pour la gestion du uploading des fichiers
  someUrlFile: any;
  filevalue: any;
  id_photo: any;
  etat: any;
  afficher_spinner_messagepublic = false;
  empty_message = false;
  error_message: string;
  // variable permettant de dynamiser l'affichage de l'info bull sur
  // le mode aanonymous
  info_bulle: string;
  // variable pour la gestion de l'affichage d'une barre de progression
  // lors de la suppression d'un message public
  visible_delete_progressbar = true;
  // le tableau de message public
  publicmessages: any;
  // the array who content filelist
  array_file_list = new Array();
  progressbaractivationmodeanonymous = 'none';
  /*afficher_spinner_progressbar: string = 'none';
  afficher_block_homepage: string = 'inline-block';*/
  checked_active_mode_anonymous = false;
  color_anonymous = 'white';
  display_emoji = false;


  constructor(private homedesign: HomeDesignService
    ,         private  router: Router
    ,         private authService: AuthService
    ,         private privateuseronlineservices: PrivateUseronlineServices
    ,         private privaterecentconvertservices: PrivateRecentconvertServices
    ,         private httpClient: HttpClient
    ,         private updateservice: UpdateService
    ,         public snackBar: MatSnackBar
    ,         public deletemessgepublocservice: DeleteMessagepublicService
    ,         private constance: ConstanceService
    ,         private messagepublicservice: MessagepublicService
    ,         private publicconvertservice: PublicConvertServices
    ,         private utilservice: UtilService
    ,         private formBuilder: FormBuilder) {


  }

  ngOnInit() {
    this.progressbaractivationmodeanonymous = 'none';
    this.checked_active_mode_anonymous = false;
    //on implemente la méthode de redirectionnement pour les mobiles
    this.constance.RedirectToDownloadPage();
    //cette condition permet de redirectionner l'utilisateur s'il na pas encore initialiser une problematique
    if (this.authService.getCookie('libelle_prob1').length === 0) {
      this.authService.etat_problematique = false;
      this.router.navigate(['problematique']);
    }
    //au cas où le cookie de libelle_prob1 est un undefined
    if (String(this.authService.getCookie('libelle_prob1')) == 'undefined') {
      this.authService.etat_problematique = false;
      this.router.navigate(['problematique']);
    }
    //this.constance.RedirectToProblematique(this.authService.etat_problematique);
    if (this.authService.getSessions().etat === '1') {
      this.checked_active_mode_anonymous = true;
      this.color_anonymous = 'warn';
    } else {
      this.checked_active_mode_anonymous = false;
      this.color_anonymous = 'white';
    }

    this.privateusersOnlineHome = this.privateuseronlineservices.userOnlines;
    this.privaterecentConvertHome = this.privaterecentconvertservices.RecentConverts;
    this.nom = this.authService.getSessions().nom;
    this.prenom = this.authService.getSessions().prenom;
    this.etat = 1;
    this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
    this.afficher_spinner_messagepublic = true;

    if (this.constance.test_updatecachephoto === 1) {
      if (this.authService.getSessions().photo === '') {
        this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
      } else {
        this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
      }
    } else if (this.constance.test_updatecachephoto === 2) {
      this.photo_user = this.authService.getSessions().photo;
    } else if (this.constance.test_updatecachephoto === 3) {
      if (this.authService.getSessions().photo === '') {
        this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
      } else {
        this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
      }
    }
    this.problematique_libelle = this.authService.getSessions().libelle_prob;

    this.messagepublicsubscription = this.messagepublicservice.messageSubject.subscribe(
      (messagepublic: MessagePublic) => {
        this.messagepublic = messagepublic;
      }
    );
    this.messagepublicservice.emitMessage();
    if (typeof this.publicconvertservice.conversationsPublics === 'undefined') {
      this.afficher_spinner_messagepublic = true;
    }
    const url = this.constance.dns.concat('/api/displayPublicMessage?id_problematique=')
      .concat(this.authService.getSessions().id_prob)
      .concat('&id_user=').concat(this.authService.getSessions().id);
    const count_notification_url = this.constance.dns
      .concat('/api/CountNotification?id_recepteur=')
      .concat(this.authService.getSessions().id);


    this.httpClient
      .get(url)
      .subscribe(
        (response1) => {


          this.publicconvertservice.conversationsPublics = response1;

          this.publicmessages = this.publicconvertservice.conversationsPublics;

          if ((this.publicconvertservice.conversationsPublics).length === 0) {
            this.empty_message = true;
            this.error_message = 'Il y a aucune publication pour cette problematique';
            this.afficher_spinner_messagepublic = false;
          } else {
            this.publicconvertservice.libelle = this.publicconvertservice.conversationsPublics[0].status_text_content;
            this.publicconvertservice.anonyme = this.publicconvertservice.conversationsPublics[0].anonymous;
            this.publicconvertservice.dateitem = this.publicmessages[0].date.date;
            this.publicconvertservice.countitem = this.publicmessages[0].countmessagepublicitem;
            this.publicconvertservice.publicconvert_id = this.publicmessages[0].id;
            this.ConnexionItemMessagePublic(this.authService.getSessions().id_prob, this.authService.getSessions().id, this.publicconvertservice.dateitem,this.publicconvertservice.publicconvert_id,this.publicconvertservice.libelle,this.publicconvertservice.anonyme);
          }
          return response1;
        },
        (error) => {
          this.afficher_spinner_messagepublic = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.empty_message = true;
          this.error_message = 'Une erreur serveur vient de se produire';
        });

    this.httpClient
      .get(count_notification_url)
      .subscribe(
        (response1) => {
          let countnotificationnumber: any;
          countnotificationnumber = response1;
          if (countnotificationnumber.count === 0) {
            this.badgeshidden = false;
          } else {
            this.badgetaille = countnotificationnumber.count;
          }
          return response1;
        },
        (error) => {
        });
    // variation des badges de messagepublic
    this.badgehidden_public_message = false;
    this.badgetaille_public_message = 10;

    //on lance la synchronization des problematiques
    this.ConnexionSynchronizationProblematique();
    //on lance la synchronization du mode anonymous
    this.ConnexionSynchronizationAnonymat();
  }

  getColor(etat: boolean) {
    if (etat) {
      return '#64B5F6';
    } else {
      return 'black';
    }
  }

  ChangeIconOne() {
    this.IconEtatColorPublicConver = true;
    this.IconEtatColorPrivateConver = false;
  }

  ChangeIconTwo() {
    this.IconEtatColorPublicConver = false;
    this.IconEtatColorPrivateConver = true;
  }

  /*La methode qui change la couleur de l'icone suivant l'onglet cliquer*/
  onLinkClick(event: MatTabChangeEvent) {

    if (event.index === 0) {
      this.ChangeIconOne();
    } else if (event.index === 1) {
      this.ChangeIconTwo();
    }
  }

  OnclickNotification() {
    this.badgeshidden = true;
    this.router.navigate(['notification']);
  }

  OnclickProblematique() {
    this.router.navigate(['problematique']);
  }

  OnDeconnect() {
    this.authService.signOut();
    this.router.navigate(['connexion']);
  }

  OnProfil() {
    this.router.navigate(['profil']);
  }

  /*Pour afficher la boite de dialogue*/
  onDialogPublicConvert() {
    this.updateservice.libelle_photo = 'PUBLIER';
    this.updateservice.dialog_update_or_display = true;
    this.updateservice.block_boite_de_dialogue = 'block';
    this.updateservice.disparaitreimage = 'none';
  }


  /*Methode pour fermer la boite de dialogue*/
  onCloseDialog() {
    const element: HTMLInputElement = document.getElementById('tenantPhotoId') as HTMLInputElement;
    if (element.files.length > 0) {
      if ( (this.array_file_list.length > 0 && this.updateservice.disparaitreimage == 'block')) {
        this.openSnackBar('Veuillez terminer votre operation', 'erreur');
      } else if ( (this.array_file_list.length > 0 && this.updateservice.disparaitreimage == 'none')) {
        this.updateservice.block_boite_de_dialogue = 'none';
      }
    } else if (this.updateservice.libellemessagepublic.length > 0) {
      this.openSnackBar('Veuillez terminer votre operation', 'erreur');
    } else if (element.files.length == 0 ) {
      this.updateservice.block_boite_de_dialogue = 'none';
      this.updateservice.disparaitreimage = 'none';
    } else {
      this.updateservice.block_boite_de_dialogue = 'none';
      this.updateservice.disparaitreimage = 'none';
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onChangeFile(event) {
    this.updateservice.disparaitreprogressbar = 'block';
    const taille = event.target.files[0].name.split('.').length;
    const extension = event.target.files[0].name.split('.')[taille - 1].toLowerCase();
    this.updateservice.imagenamefordelete = extension;
    let anonymous: string;
    if (this.authService.getSessions().etat === '1') {
      anonymous = '1';
    } else {
      anonymous = '0';
    }
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.updateservice.imageSrc = reader.result;

        reader.readAsDataURL(file);
        this.filevalue = file;
        this.array_file_list.push(this.filevalue);
        const urlrecuperefile = this.constance.dns.concat('/api/photomessagepublic?file_extension=').concat(extension)
          .concat('&id_user=').concat(this.authService.sessions.id).concat('&id_problematique=')
          .concat(this.authService.sessions.id_prob).concat('&anonymous=').concat(anonymous);
        this.httpClient
          .get(urlrecuperefile)
          .subscribe(
            (response) => {
              this.constance.name_file = response;
              const url1 = this.constance.dns1.concat('/uploads/uploadScript.php');
              const formData: FormData = new FormData();
              formData.append('photostatus', this.filevalue);
              formData.append('name_file', this.constance.name_file.name_file);
              this.updateservice.imagenamefordelete = this.constance.name_file.name_file.concat('.').concat(extension);
              this.updateservice.id_message_public = this.constance.name_file.id_messagepublic;
              this.id_photo = this.constance.name_file.ID_photo;
              this.httpClient
                .post(url1, formData)
                .subscribe(
                  (response) => {
                    this.updateservice.disparaitreprogressbar = 'none';
                    this.updateservice.disparaitreimage = 'block';
                    this.etat = 0;
                  },
                  (error) => {
                    this.updateservice.disparaitreprogressbar = 'none';
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                  }
                );

              return response;
            },
            (error) => {
              this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
              this.updateservice.disparaitreprogressbar = 'none';
            }
          );

      }

    } else {
      this.openSnackBar('Veuillez choisir une image', 'erreur');
    }
  }

  onpenFileBrowser(event: any) {
    event.preventDefault();
    const element: HTMLElement = document.getElementById('tenantPhotoId') as HTMLElement;
    element.click();
  }



  ngOnDestroy() {
    this.messagepublicsubscription.unsubscribe();
  }

  addMessagePublic() {
      const libellemessagepublic = this.updateservice.libellemessagepublic;
      const element: HTMLInputElement = document.getElementById('tenantPhotoId') as HTMLInputElement;
      if (this.updateservice.libellemessagepublic.length === 0 && element.files.length === 0 ) {
        this.openSnackBar('Veuillez terminer votre operation', 'erreur');
      } else {
        this.updateservice.disparaitrechamp = 'none';
        this.updateservice.disparaitreimage = 'none';
        this.updateservice.disparaitreprogressbar = 'block';
        let anonymous: string;
        if (this.authService.getSessions().etat === '1') {
          anonymous = '1';
        } else {
          anonymous = '0';
        }
        const url = this.constance.dns.concat('/api/SaveMessagePublic?etat=')
          .concat(this.etat).concat('&libelle=').concat(libellemessagepublic).concat('&id_problematique=')
          .concat(this.authService.getSessions().id_prob).concat('&ID=').concat(this.authService.getSessions().id)
          .concat('&id_message_public=').concat(String(this.updateservice.id_message_public))
          .concat('&anonymous=').concat(anonymous);
        this.httpClient
          .get(url)
          .subscribe(
            (response1) => {
              this.empty_message = false;
              this.constance.messagepublicobject = response1;
              this.updateservice.disparaitrechamp = 'block';
              this.updateservice.disparaitreimage = 'none';
              this.updateservice.libellemessagepublic = null;
              this.updateservice.disparaitreprogressbar = 'none';
              this.updateservice.block_boite_de_dialogue = 'none';
              const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
              const maleosama = {
                checkmention: 0,
                countcomment: 0,
                countjaime: 0,
                countjaimepas: 0,
                etat_photo_status: '',
                id: 0,
                id_checkmention: 0,
                name: '',
                status_text_content: '',
                status_photo: '',
                updated: '',
                user_id: 0,
                user_photo: '',
                visibility: true
              };
              this.etat = 1;
              maleosama.checkmention = 0;
              maleosama.countcomment = 0;
              maleosama.countjaime = 0;
              maleosama.countjaimepas = 0;
              maleosama.etat_photo_status =  this.constance.messagepublicobject.etat_photo_status;
              maleosama.id = this.constance.messagepublicobject.id;
              maleosama.id_checkmention = 0;
              maleosama.name = nom_du_user;
              maleosama.status_text_content = libellemessagepublic;
              maleosama.status_photo = this.constance.messagepublicobject.status_photo;
              //console.log(maleosama.status_photo);
              //console.log(maleosama.etat_photo_status);
              maleosama.updated = this.constance.messagepublicobject.updated;
              maleosama.user_id = this.authService.sessions.id;
              maleosama.user_photo = this.authService.getSessions().photo;


              maleosama.visibility = true;
              this.updateservice.disparaitreimage = 'none';
              this.publicconvertservice.conversationsPublics.unshift(maleosama);
              this.publicmessages = this.publicconvertservice.conversationsPublics;
              this.openSnackBar('Insertion effectuee avec succes !', 'succes');

              return response1;
            },
            (error) => {
              this.updateservice.disparaitrechamp = 'block';
              this.updateservice.disparaitreimage = 'block';
              this.updateservice.disparaitreprogressbar = 'none';
              this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
            }
          );
      }
    /*}*/ /*else if (this.updateservice.libelle_photo === 'MODIFIER') {
      const libellemessagepublic = this.updateservice.libellemessagepublic;
      this.updateservice.disparaitrechamp = 'none';
      this.updateservice.disparaitreimage = 'none';
      this.updateservice.disparaitreprogressbar = 'block';
      const url = this.constance.dns.concat('/api/UpdateMessagePublic?ID=')
        .concat(this.authService.getSessions().id)
        .concat('&id_problematique=').concat(this.authService.getSessions().id_prob)
        .concat('&id_message_public=').concat(String(this.updateservice.id_message_public))
        .concat('&photo=2')
        .concat('&libelle=').concat(libellemessagepublic);
      this.httpClient
        .get(url)
        .subscribe(
          (response1) => {
            this.constance.messagepublicobject = response1;
            this.updateservice.disparaitrechamp = 'block';
            this.updateservice.disparaitreimage = 'none';
            this.updateservice.libellemessagepublic = null;
            this.updateservice.disparaitreprogressbar = 'none';
            this.updateservice.block_boite_de_dialogue = 'none';
            const nom_du_user = ''.concat(this.authService.sessions.prenom).concat(' ').concat(this.authService.sessions.nom);
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].etat_photo_status =  this.constance.messagepublicobject.etat_photo_status;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].id = this.constance.messagepublicobject.id;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].name = nom_du_user;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].status_text_content = libellemessagepublic;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].status_photo = this.constance.messagepublicobject.status_photo;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].updated = this.constance.messagepublicobject.updated;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].user_id = this.authService.sessions.id;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].user_photo = this.authService.getSessions().photo;
            this.publicconvertservice.conversationsPublics[this.updateservice.indexOf].visibility = true;
            this.updateservice.disparaitreimage = 'none';
            this.publicmessages = this.publicconvertservice.conversationsPublics;
            this.openSnackBar('Votre modification s\'est effectuee avec succes !!', 'succes');

            return response1;
          },
          (error) => {
            this.updateservice.disparaitrechamp = 'block';
            this.updateservice.disparaitreimage = 'block';
            this.updateservice.disparaitreprogressbar = 'none';
            this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          }
        );

    }*/

  }

  // methode pour supprimer la photo d'un status
  OnSupprimerPhoto() {
    this.updateservice.disparaitreimage = 'none';
    this.updateservice.disparaitreprogressbar = 'block';
    const urltemp = this.constance.dns1.concat('/uploads/removeuploadScript.php?nomdufichier=').concat(this.updateservice.imagenamefordelete);
    this.httpClient
      .get(urltemp)
      .subscribe(
        (response) => {
          this.updateservice.disparaitreprogressbar = 'none';
          const urldelete = this.constance.dns.concat('/api/deletephotomessagepublic?ID=').concat(String(this.updateservice.id_message_public)).concat('&ID_photo=').concat(this.updateservice.id_photo);
          this.httpClient
            .get(urldelete)
            .subscribe(
              (response1) => {
                this.updateservice.disparaitreprogressbar = 'none';
                this.etat = 1;
                return response1;
              },
              (error) => {
              }
            );
          return response;
        },
        (error) => {
          this.updateservice.disparaitreprogressbar = 'none';
          this.updateservice.disparaitreimage = 'block';
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
        }
      );
  }

  ModeAnonymous(event: MatSlideToggleChange) {
    this.checked_active_mode_anonymous = !this.checked_active_mode_anonymous;
    this.progressbaractivationmodeanonymous = 'block';
    const dtExpire = new Date();
    dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
    if (event.checked) {
      this.color_anonymous = 'warn';
      this.info_bulle = 'Cliquez ici pour désactiver le mode anonymous';
      const url_modeanymous = this.constance.dns
        .concat('/api/AnonymousModeActivation?user_id=')
        .concat(this.authService.getSessions().id)
        .concat('&etat=1');
      this.httpClient
        .get(url_modeanymous)
        .subscribe(
          (response1) => {
            this.info_bulle = 'Cliquez ici pour désactiver le mode anonymous';
            this.progressbaractivationmodeanonymous = 'none';
            this.openSnackBar('Votre mode anonymous est activer avec succes !', 'succes');
            this.progressbaractivationmodeanonymous = 'none';
            this.authService.sessions.etat = '1';
           // this.etat = 1;
            this.authService.sessions.nom = 'Anonyme';
            this.authService.sessions.prenom = 'Utilisateur';
            this.authService.sessions.photo = 'ic_profile_anonymous.png';
            this.authService.setCookie('etat1', this.authService.sessions.etat, dtExpire, '/', null, null );
            this.authService.setCookie('nom1', 'Anonyme', dtExpire, '/', null, null );
            this.authService.setCookie('prenom1', 'Utilisateur', dtExpire, '/', null, null );
            this.authService.setCookie('photo1', 'ic_profile_anonymous.png', dtExpire, '/', null, null );
            this.photo_user = this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile_anonymous.png');
            this.nom = 'Anonyme';
            this.prenom = 'Utilisateur';

            return response1;
          },
          (error) => {
            this.progressbaractivationmodeanonymous = 'none';
            this.openSnackBar('Une erreur reseau vient de se produire !', 'erreur');
            this.checked_active_mode_anonymous = false;
            this.progressbaractivationmodeanonymous = 'none';
          }
        );
    } else {
      this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
      const url_modeanymous = this.constance.dns
        .concat('/api/AnonymousModeActivation?user_id=')
        .concat(this.authService.getSessions().id)
        .concat('&etat=0');
      this.httpClient
        .get(url_modeanymous)
        .subscribe(
          (response1) => {
            //console.log(response1);
            let reponse : any;
            reponse = response1;
            this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
            this.progressbaractivationmodeanonymous = 'none';
            this.openSnackBar('Votre mode anonymous est desactiver avec succes !', 'succes');
            this.progressbaractivationmodeanonymous = 'none';
            this.authService.sessions.etat = '0';
            this.authService.setCookie('etat1', this.authService.sessions.etat, dtExpire, '/', null, null );
            this.authService.setCookie('nom1', reponse.nom, dtExpire, '/', null, null );
            this.authService.setCookie('prenom1', reponse.prenom, dtExpire, '/', null, null );
            this.authService.setCookie('photo1', reponse.photo, dtExpire, '/', null, null );
            this.photo_user = this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(reponse.photo);
            this.nom = reponse.nom;
            this.prenom = reponse.prenom;
            //this.etat = 0;
            this.authService.sessions.nom = reponse.nom;
            this.authService.sessions.prenom = reponse.prenom;
            this.authService.sessions.photo = reponse.photo;
            //on contrôle le cas où il n'y a pas de photo
            if (this.authService.getSessions().photo === '') {
              this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
            }

            return response1;
          },
          (error) => {
            this.progressbaractivationmodeanonymous = 'none';
            this.openSnackBar('Une erreur reseau vient de se produire !', 'erreur');
            this.progressbaractivationmodeanonymous = 'none';
            this.checked_active_mode_anonymous = true;
          }
        );
    }
  }

  // this button is used for close the delete message public dialog
  deletecloseDialog() {
    this.deletemessgepublocservice.displaydialog = 'none';
  }

  // this function delete a message public
  deletemessagepublic() {
    // this.deletemessgepublocservice.displaydialog = 'none';
    this.visible_delete_progressbar = false;
    if (this.deletemessgepublocservice.etat_photo_status === 'block') {
      // url for delete phycally the photo
      const urldeletephoto = this.constance.dns1.concat('/uploads/removeuploadScript.php?nomdufichier=')
        .concat(this.deletemessgepublocservice.photo_message_public);
      // url for delete message public in the database
      const urldeletemessagepublic = this.constance.dns
        .concat('/api/deletephotomessagepublic?ID=')
        .concat(String(this.deletemessgepublocservice.id_message_public))
        .concat('&ID_photo=').concat(String(this.deletemessgepublocservice.id_photo))
        .concat('&count=').concat(String(this.deletemessgepublocservice.count));
      this.httpClient
        .get(urldeletephoto)
        .subscribe(
          (response1) => {
            this.deletemessgepublocservice.displaydialog = 'none';
            this.visible_delete_progressbar = true;
            this.publicconvertservice.conversationsPublics[this.deletemessgepublocservice.indexOf].visibility = false;
            this.publicmessages = this.publicconvertservice.conversationsPublics;
            this.openSnackBar('Suppression effectuee avec succes !!', 'succes');
            return response1;
          },
          (error) => {
            this.deletemessgepublocservice.displaydialog = 'none';
            this.visible_delete_progressbar = true;
            this.openSnackBar('Une erreur vient de survenir', 'erreur');
          }
        );

      this.httpClient
        .get(urldeletemessagepublic)
        .subscribe(
          (response1) => {
            return response1;
          },
          (error) => {
          }
        );

      this.httpClient
        .get(urldeletephoto)
        .subscribe(
          (response1) => {
            return response1;
          },
          (error) => {
          }
        );

    } else if (this.deletemessgepublocservice.etat_photo_status === 'none') {
      const urldeletemessagepublic = this.constance.dns
        .concat('/api/deletephotomessagepublic?ID=')
        .concat(String(this.deletemessgepublocservice.id_message_public))
        .concat('&count=').concat(String(this.deletemessgepublocservice.count));
      this.httpClient
        .get(urldeletemessagepublic)
        .subscribe(
          (response1) => {
            this.deletemessgepublocservice.displaydialog = 'none';
            this.visible_delete_progressbar = true;
            this.publicconvertservice.conversationsPublics[this.deletemessgepublocservice.indexOf].visibility = false;
            this.publicmessages = this.publicconvertservice.conversationsPublics;
            this.openSnackBar('Suppression effectuee avec succes !!', 'succes');
            return response1;
          },
          (error) => {
            this.deletemessgepublocservice.displaydialog = 'none';
            this.visible_delete_progressbar = true;
            this.openSnackBar('Une erreur vient de survenir', 'erreur');
          }
        );
    }
  }

  onCloseUpdateDialog() {
    this.updateservice.block_boite_de_dialogue = 'none';
    this.updateservice.libellemessagepublic = '';
  }

  RootToHistory() {
    this.router.navigate(['history']);
  }

  Reactualiser() {
    this.empty_message = false;
    this.afficher_spinner_messagepublic = true;
    const url = this.constance.dns.concat('/api/displayPublicMessage?id_problematique=')
      .concat(this.authService.getSessions().id_prob)
      .concat('&id_user=').concat(this.authService.getSessions().id);
    this.httpClient
      .get(url)
      .subscribe(
        (response1) => {
          this.publicconvertservice.conversationsPublics = response1;
          this.publicmessages = this.publicconvertservice.conversationsPublics;
          this.afficher_spinner_messagepublic = false;
          if ((this.publicconvertservice.conversationsPublics).length === 0) {
            this.empty_message = true;
            this.error_message = 'Il y a aucune publication pour cette problematique';
          }
          return response1;
        },
        (error) => {
          this.afficher_spinner_messagepublic = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.empty_message = true;
          this.error_message = 'Une erreur serveur vient de se produire';
        });
    const count_notification_url = this.constance.dns
      .concat('/api/CountNotification?id_recepteur=')
      .concat(this.authService.getSessions().id);
    this.httpClient
      .get(count_notification_url)
      .subscribe(
        (response1) => {
          let countnotificationnumber: any;
          countnotificationnumber = response1;
          if (countnotificationnumber.count === 0) {
            this.badgeshidden = false;
          } else {
            this.badgetaille = countnotificationnumber.count;
          }
          return response1;
        },
        (error) => {
        });
  }

  //this function help us to add our emoji in our textearea
 // addEmoji(event) {
    //console.log(event.emoji.native);
    //let emoji_block_inline : string;
    //const emoji_block_inline = event.emoji.native;
    //const myspan: HTMLSpanElement;
    //myspan.className = 'emojistyle';
    //myspan.innerText = 'test du boss !!';
    //event.emoji.native
    /*const element = document.createElement('span');
    element.className = 'emojistyle';
    element.innerText = event.emoji.native;
    const mytextarea: HTMLInputElement = document.getElementById('problematique') as HTMLTextAreaElement;

    mytextarea.innerHTML = element;

    console.log(element.innerText);*/
    /*const element: HTMLSpanElement = document.createElement('span');
    element.className = 'emojistyle';
    element.innerText = event.emoji.native;*/
    //const elementtemp: HTMLElement = document.getElementById('textarea') as HTMLDivElement;
    //const emojitemp = '<span class="emojistyle">'.concat(event.emoji.native).concat('</span>');
    //this.updateservice.libellemessagepublic = elementtemp.innerHTML.concat(emojitemp).concat('<span class="policy_transition"></span>');
    /*console.log(element);*/
    /*const elementtemp: HTMLElement = document.getElementById('textarea') as HTMLDivElement;
    elementtemp.innerHTML = elementtemp;*/
    //console.log(event);
  //}

  //This function help us to display our emoji manager
  //displayemojimanager() {
  //  this.display_emoji = !this.display_emoji;
 // }

  //onInputOurTextArea(event) {
    //const elementtemp: HTMLElement = document.getElementById('textarea') as HTMLDivElement;
    //this.updateservice.libellemessagepublic = elementtemp.innerHTML;
   // elementtemp.focus();
    //this.updateservice.libellemessagepublic = '<span>'.concat(this.updateservice.libellemessagepublic).concat('</span>');
    //this.updateservice.libellemessagepublic = this.updateservice.libellemessagepublic.concat('<span>').concat(event.data).concat('</span>');

    /*if (event.data != null) {
      this.updateservice.libellemessagepublic = this.updateservice.libellemessagepublic.concat('<span>').concat(event.data).concat('</span>');
    }
    console.log(event);*/

    //console.log(event.data);
    /*this.updateservice.libellemessagepublictemp = this.updateservice.libellemessagepublic.concat(event.data);*/
 // }

  ConnexionItemMessagePublic( id_problematique : any, id_user : any, date: any, publicconvert_id:any,libelle:any,anonyme:any) {

    const url_lazy_loading = this.constance.dns.concat('/api/displayMessagePublicItem?id_problematique=')
                .concat(String(id_problematique)).concat('&id_user=')
                .concat(String(id_user))
                .concat('&date=').concat(String(date)).concat('&publicconvert_id=').concat(String(publicconvert_id))
                .concat('&libelle=').concat(libelle).concat('&anonyme=').concat(anonyme);

    this.httpClient
      .get(url_lazy_loading)
      .subscribe(
        (response1) => {
          let temp: any;
          temp =   response1;

          const temp_countitem = (this.publicconvertservice.countitem - this.publicmessages.length);
          if (temp_countitem >= 1){
            //console.log(temp[0]);
            this.publicconvertservice.publicconvert_id = temp[0].id;
            this.publicconvertservice.libelle = temp[0].status_text_content;
            this.publicconvertservice.anonyme = temp[0].anonymous;

            //console.log(temp[0].date.date);

            //this.publicconvertservice.libelle =
            this.publicmessages.push(temp[0]);
          //  console.log(this.authService.getSessions().id_prob);
            this.ConnexionItemMessagePublic(this.authService.getSessions().id_prob, this.authService.getSessions().id, temp[0].date.date,this.publicconvertservice.publicconvert_id,temp[0].status_text_content,temp[0].anonymous);
          }

          if (temp_countitem == 1 || temp_countitem == 0) {
            this.afficher_spinner_messagepublic = false;
          }

          return response1;
        },
        (error) => {

        });

  }


  //Ce service web permet de synchroniser le changement
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
              this.problematique_libelle = reponse.problematique_libelle;
          }
          return response;
        },
        (error) => {

        });
  }

  //Ce service web permet d'assurer la synchronisation après le changement de mode d'anonymat
  ConnexionSynchronizationAnonymat() {
    const url_synchronization_anonymat = this.constance.dns.concat('/api/DisplayUserAnonymousState?user_id=').concat(String(this.authService.getSessions().id));
    this.httpClient
      .get(url_synchronization_anonymat)
      .subscribe(
        (response) => {
          let reponse : any;
          reponse = response;
          const dtExpire = new Date();
          dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
          if (reponse.user_etat === 1) {
            this.info_bulle = 'Cliquez ici pour désactiver le mode anonymous';
            this.progressbaractivationmodeanonymous = 'none';
            //this.openSnackBar('Votre mode anonymous est activer avec succes !', 'succes');
            this.progressbaractivationmodeanonymous = 'none';
            this.authService.sessions.etat = '1';
            // this.etat = 1;
            this.authService.sessions.nom = 'Anonyme';
            this.authService.sessions.prenom = 'Utilisateur';
            this.authService.sessions.photo = 'ic_profile_anonymous.png';
            this.authService.setCookie('etat1', this.authService.sessions.etat, dtExpire, '/', null, null );
            this.authService.setCookie('nom1', 'Anonyme', dtExpire, '/', null, null );
            this.authService.setCookie('prenom1', 'Utilisateur', dtExpire, '/', null, null );
            this.authService.setCookie('photo1', 'ic_profile_anonymous.png', dtExpire, '/', null, null );
            this.photo_user = this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile_anonymous.png');
            this.nom = 'Anonyme';
            this.prenom = 'Utilisateur';
            this.checked_active_mode_anonymous = true;
            this.color_anonymous = 'warn';
          } else if (reponse.user_etat === 0) {

            this.info_bulle = 'Cliquez ici pour activer le mode anonymous';
            this.progressbaractivationmodeanonymous = 'none';
            //this.openSnackBar('Votre mode anonymous est desactiver avec succes !', 'succes');
            this.progressbaractivationmodeanonymous = 'none';
            this.authService.sessions.etat = '0';
            this.authService.setCookie('etat1', this.authService.sessions.etat, dtExpire, '/', null, null );
            this.authService.setCookie('nom1', reponse.nom, dtExpire, '/', null, null );
            this.authService.setCookie('prenom1', reponse.prenom, dtExpire, '/', null, null );
            this.authService.setCookie('photo1', reponse.photo, dtExpire, '/', null, null );
            this.photo_user = this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(reponse.photo);
            this.nom = reponse.nom;
            this.prenom = reponse.prenom;
            //this.etat = 0;
            this.authService.sessions.nom = reponse.nom;
            this.authService.sessions.prenom = reponse.prenom;
            this.authService.sessions.photo = reponse.photo;
            //on contrôle le cas où il n'y a pas de photo
            if (this.authService.getSessions().photo === '') {
              this.photo_user = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile.png');
            }
            this.checked_active_mode_anonymous = false;
            this.color_anonymous = 'white';
          }





          return response;
        },
        (error) => {

        });
  }

}




