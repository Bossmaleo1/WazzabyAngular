import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {MatSlideToggleChange} from '@angular/material';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  hide = true;
  primary_color: string = '#448AFF';
  icon_libelle: string = "arrow_back";
  title_libelle: string = 'Profil';
  tooltip_title:string = '';

  //cet attribut permet de dynamiser l'info bulle du darkmode
  info_bulle_dark_mode: string = '';
  //cet attribut permet de dynamiser le bouton switch du darkmode
  checked_active_dark_mode : boolean = false;
  color_dark_mode = 'white';

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

    //on test si le mode dark est activé ou pas
    if (String(this.authService.getCookie('darkmode1')) == '0') {
      this.checked_active_dark_mode = false;
      this.color_dark_mode = 'white';
      this.constance.primary_color = '#448AFF';
      this.constance.backgroundcolor = '#F5F5F5';
    } else if (String(this.authService.getCookie('darkmode1')) == '1') {
      this.checked_active_dark_mode = true;
      this.color_dark_mode = 'warn';
      this.constance.primary_color = '#424242';
      this.constance.backgroundcolor = '#212121';
      this.constance.cardview_background = '#424242';
      this.constance.cardview_textcolor = 'white';
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

  DarkMode(event: MatSlideToggleChange) {
    const dtExpire = new Date();
    dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
    if (event.checked) {
      this.info_bulle_dark_mode = 'Cliquez ici pour désactiver le dark mode';
      this.color_dark_mode = 'warn';
      this.authService.setCookie('darkmode1', 1, dtExpire, '/', null, null );
    } else {
      this.info_bulle_dark_mode = 'Cliquez ici pour activer le dark mode';
      this.color_dark_mode = 'white';
      this.authService.setCookie('darkmode1', 0, dtExpire, '/', null, null );
    }

  }

}
