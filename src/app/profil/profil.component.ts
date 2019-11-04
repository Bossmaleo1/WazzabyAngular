import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  hide = true;

  icon_libelle: string = "arrow_back";
  title_libelle: string = 'Profil';
  tooltip_title:string = '';

  constructor(private  router: Router
    , private authService: AuthService
    , private _location: Location
    , private httpClient: HttpClient
    , private constance: ConstanceService) { }

  ngOnInit() {
    //On synchronise les problematique
    this.ConnexionSynchronizationProblematique();
    //au cas où le cookie de libelle_prob1 est un undefined
    if (String(this.authService.getCookie('libelle_prob1')) == 'undefined') {
      /*this.authService.etat_problematique = false;
      this.router.navigate(['problematique']);*/
      this.icon_libelle = 'arrow_forward';
      this.title_libelle = 'Bienvenue dans Wazzaby !!';
      this.tooltip_title = 'Passer à l\'étape suivante ?';
    }
  }

  OnBack() {
    if ((String(this.authService.getCookie('libelle_prob1')) == 'undefined')) {
      this.router.navigate(['home']);
    } else {
      this._location.back();
    }

  }

  OnDeconnect() {
    this.authService.signOut();
    this.router.navigate(['connexion']);
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

  RootToProb() {
    this.router.navigate(['problematique']);
  }


}
