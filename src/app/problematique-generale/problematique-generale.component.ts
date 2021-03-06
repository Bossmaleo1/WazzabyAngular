import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {ProblematiqueItemService} from '../Services/problematique.item.service';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-problematique-generale',
  templateUrl: './problematique-generale.component.html',
  styleUrls: ['./problematique-generale.component.scss']
})
export class ProblematiqueGeneraleComponent implements OnInit {

  afficher_spinner = false;
  libelle_catprob = '';
  title_prob: String;

  constructor(private  router: Router
    , private authService: AuthService
    , public snackBar: MatSnackBar
    , private httpClient: HttpClient
    , private _location: Location
    , private constance: ConstanceService
    , public problematiqueitemservice: ProblematiqueItemService) { }

  ngOnInit() {
    const url = this.constance.dns.concat('/api/displayAllcatprob');
    this.problematiqueitemservice.afficher_spinner_probgen = true;
    this.problematiqueitemservice.afficher_network_error = false;
    this.connexionToServer(url);
    this.problematiqueitemservice.testprobcomponent = 1;
    this.title_prob = this.problematiqueitemservice.Libelle;
    //On synchronise les problematique
    this.ConnexionSynchronizationProblematique();

    //on test si le mode dark est activé ou pas
    if (String(this.authService.getCookie('darkmode1')) == '0') {
      this.constance.primary_color = '#448AFF';
      this.constance.backgroundcolor = '#F5F5F5';
    } else if (String(this.authService.getCookie('darkmode1')) == '1') {
      this.constance.primary_color = '#424242';
      this.constance.backgroundcolor = '#212121';
      this.constance.cardview_background = '#424242';
      this.constance.cardview_textcolor = 'white';
    }
  }

  OnBack() {
    this._location.back();
  }

  OnDeconnect() {
    this.authService.signOut();
    this.router.navigate(['connexion']);
  }

  connexionToServer(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.problematiqueitemservice.problematiquescat  = response;
          this.problematiqueitemservice.afficher_spinner_probgen = false;
          this.problematiqueitemservice.afficher_network_error = false;
        },
        (error) => {
          this.afficher_spinner = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.problematiqueitemservice.afficher_spinner_probgen = false;
          this.problematiqueitemservice.afficher_network_error = true;
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onSearchProb(event) {
    const url = this.constance.dns.concat('/api/ProbElasticSearchService?libelle_catprob=').concat(this.libelle_catprob);
    this.connexionToServer(url);
  }

  Reactualize() {
    this.problematiqueitemservice.afficher_spinner_probgen = true;
    this.problematiqueitemservice.afficher_network_error = false;
    const url = this.constance.dns.concat('/api/displayAllcatprob');
    this.connexionToServer(url);
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
            this.authService.setCookie('libelle_prob', reponse.problematique_libelle, dtExpire, '/', null, null );
            this.authService.setCookie('id_prob', reponse.problematique_id, dtExpire, '/', null, null );
          }
          return response;
        },
        (error) => {

        });
  }
}
