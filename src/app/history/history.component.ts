import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {UpdateService} from '../Services/update.service';
import {ConstanceService} from '../Services/Constance.service';
import {PublicConvertServices} from '../Services/public.convert.services';
import {MessagepublicService} from '../Services/messagepublic.service';
import {MessagePublic} from '../models/MessagePublic.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  afficher_spinner_messagepublic = false;
  empty_message = false;
  error_message: string;
  messagepublic: MessagePublic;
  publicmessages: any;

  constructor(private  router: Router
    , private authService: AuthService
    , public snackBar: MatSnackBar
    , private messagepublicservice: MessagepublicService
    , private constance: ConstanceService
    , private publicconvertservice: PublicConvertServices
    , private updateservice: UpdateService
    , private httpClient: HttpClient) { }

  ngOnInit() {
    this.afficher_spinner_messagepublic = true;
    const url = this.constance.dns.concat('/api/HistoriqueMessagePublic?id_problematique=')
      .concat(this.authService.getSessions().id_prob)
      .concat('&id_user=').concat(this.authService.getSessions().id);

    this.httpClient
      .get(url)
      .subscribe(
        (response1) => {
          let temp : any;
          temp = response1;
          //console.log(this.publicconvertservice.conversationsPublics);
          this.publicconvertservice.conversationsPublics = response1;
          /*this.publicmessages = this.publicconvertservice.conversationsPublics;
          this.publicconvertservice.dateitem = this.publicmessages[0].date.date;
          this.publicconvertservice.countitem = this.publicmessages[0].countmessagepublichistorique;
          this.publicconvertservice.publicconvert_id = temp[0].id;
          this.publicconvertservice.libelle = temp[0].status_text_content;*/

         // this.ConnexionItemHistoriqueMessagePublic();

          if ((this.publicconvertservice.conversationsPublics).length === 0) {
            this.empty_message = true;
            this.error_message = 'Il y a aucune publication pour cette problematique';
            this.openSnackBar(this.error_message, 'erreur');
          } else {
            this.publicmessages = this.publicconvertservice.conversationsPublics;
            this.publicconvertservice.dateitem = this.publicmessages[0].date.date;
            this.publicconvertservice.countitem = this.publicmessages[0].countmessagepublichistorique;
            this.publicconvertservice.publicconvert_id = temp[0].id;
            this.publicconvertservice.libelle = temp[0].status_text_content;

            this.ConnexionItemHistoriqueMessagePublic();
          }
          return response1;
        },
        (error) => {
          this.afficher_spinner_messagepublic = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.empty_message = true;
          this.error_message = 'Une erreur serveur vient de se produire';

        });

    //On synchronise les problematique
    this.ConnexionSynchronizationProblematique();
  }

  OnBack() {
    this.router.navigate(['home']);
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  Reactualise() {
    this.afficher_spinner_messagepublic = true;
    this.empty_message = false;
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
            this.openSnackBar(this.error_message, 'erreur');
            this.afficher_spinner_messagepublic = false;
          }
          return response1;
        },
        (error) => {
          this.afficher_spinner_messagepublic = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.empty_message = true;
          this.error_message = 'Une erreur serveur vient de se produire';

        });
  }

  ConnexionItemHistoriqueMessagePublic() {
    const url_lazy_loading = this.constance.dns.concat('/api/HistoriqueMessagePublicItem?id_problematique=')
      .concat(String(this.authService.getSessions().id_prob)).concat('&id_user=')
      .concat(String(this.authService.getSessions().id))
      .concat('&publicconvert_id=').concat(String(this.publicconvertservice.publicconvert_id))
      .concat('&date=').concat(String(this.publicconvertservice.dateitem))
      .concat('&libelle=').concat(String(this.publicconvertservice.libelle));

    this.httpClient
      .get(url_lazy_loading)
      .subscribe(
        (response1) => {
          let temp: any;
          temp =   response1;
          for (let i = 0; i < temp.length; i++) {
            this.publicmessages.push(temp[i]);
          }

          const temp_countitem = (this.publicconvertservice.countitem - this.publicmessages.length);
          if (temp_countitem >= 1 ) {
            this.publicconvertservice.dateitem = temp[0].date.date;
            this.publicconvertservice.publicconvert_id = temp[0].id;
            this.publicconvertservice.libelle = temp[0].status_text_content;
            this.publicconvertservice.anonyme = temp[0].anonymous;
            this.ConnexionItemHistoriqueMessagePublic();
          }

          if (temp_countitem == 1 || temp_countitem == 0) {
            this.afficher_spinner_messagepublic = false;
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

            console.log("C'est un succès !!");

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
