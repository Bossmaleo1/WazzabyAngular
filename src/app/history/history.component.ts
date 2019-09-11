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
          this.publicconvertservice.conversationsPublics = response1;
          this.publicmessages = this.publicconvertservice.conversationsPublics;
          this.afficher_spinner_messagepublic = false;
          if ((this.publicconvertservice.conversationsPublics).length === 0) {
            this.empty_message = true;
            this.error_message = 'Il y a aucune publication pour cette problematique';
            this.openSnackBar(this.error_message, 'erreur');
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
}
