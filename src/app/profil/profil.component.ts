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

  constructor(private  router: Router
    , private authService: AuthService
    , private _location: Location
    , private httpClient: HttpClient
    , private constance: ConstanceService) { }

  ngOnInit() {
    //On synchronise les problematique
    this.ConnexionSynchronizationProblematique();
  }

  OnBack() {
    this._location.back();
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


}
