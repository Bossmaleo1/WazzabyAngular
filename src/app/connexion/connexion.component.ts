import { Component, OnInit } from '@angular/core';
import {AuthService} from '../Services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  authStatus: boolean;
  hide = true;
  //ngIf qui affiche le Spinner
  afficher_spinner = false;

  constructor(private authService: AuthService
    , private  router: Router
    , private httpClient: HttpClient
    , public snackBar: MatSnackBar
    , private constance: ConstanceService) { }

  ngOnInit() {
    this.authStatus = this.authService.isAuth;
    //on implemente la méthode de redirectionnement pour les mobiles
    this.constance.RedirectToDownloadPage();
    //this.afficher_spinner = true;
    if (String(this.authService.getCookie('nom1')) != 'null') {
      const maleosama = new Object();
      maleosama['libelle_prob'] = this.authService.getCookie('libelle_prob1');
      if (this.authService.getCookie('etat1') === '1') {
        maleosama['nom'] = 'Anonyme';
        maleosama['prenom'] = 'Utilisateur';
        maleosama['photo'] = 'ic_profile_anonymous.png';
      } else {
        maleosama['nom'] = this.authService.getCookie('nom1');
        maleosama['prenom'] = this.authService.getCookie('prenom1');
        maleosama['photo'] = this.authService.getCookie('photo1');
      }
      maleosama['email'] = this.authService.getCookie('email1');
      maleosama['id'] = this.authService.getCookie('id1');
      maleosama['id_prob'] = this.authService.getCookie('id_prob1');
      maleosama['keypush'] = this.authService.getCookie('keypush1');
      maleosama['langue'] =  this.authService.getCookie('langue1');
      maleosama['datenaissance'] = this.authService.getCookie('datenaissance1');
      maleosama['sexe'] = this.authService.getCookie('sexe1');
      maleosama['ville'] = this.authService.getCookie('ville1');
      maleosama['online'] = this.authService.getCookie('online1');
      maleosama['etat'] = this.authService.getCookie('etat1');
      this.authService.sessions = maleosama;
      this.authService.isAuth = true;
      this.router.navigate(['home']);
    }
  }


  onSubmit(form: NgForm) {
    this.afficher_spinner = true;
    const email = form.value['email'];
    const password = form.value['password'];
    const url = this.constance.dns.concat('/api/connexion?email=').concat(email).concat('&password=').concat(password);
    this.connexionToServer(url);
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  connexionToServer(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.authService.sessions = response;
          let dtExpire = new Date();
          dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
          if (this.authService.sessions.succes === 1) {
            const libelle_boss = this.authService.sessions.libelle_prob;
            this.constance.test_updatecachephoto = 1;
            if (libelle_boss.length > 0) {
              this.authService.isAuth = true;
              this.authService.etat_problematique = true;
              this.router.navigate(['home']);
            } else {
              this.authService.isAuth = true;
              this.authService.etat_problematique = false;
              this.router.navigate(['problematique']);
            }

            this.authService.setCookie('libelle_prob1', this.authService.sessions.libelle_prob, dtExpire, '/', null, null );
            this.authService.setCookie('email1', this.authService.sessions.email, dtExpire, '/', null, null );
            this.authService.setCookie('id1', this.authService.sessions.id, dtExpire, '/', null, null );
            this.authService.setCookie('id_prob1', this.authService.sessions.id_prob, dtExpire, '/', null, null );
            this.authService.setCookie('keypush1', this.authService.sessions.keypush, dtExpire, '/', null, null );
            this.authService.setCookie('langue1', this.authService.sessions.langue, dtExpire, '/', null, null );
            this.authService.setCookie('pays1', this.authService.sessions.pays, dtExpire, '/', null, null );
            this.authService.setCookie('datenaissance1', (this.authService.sessions.datenaissance).date, dtExpire, '/', null, null );
            this.authService.setCookie('sexe1', this.authService.sessions.sexe, dtExpire, '/', null, null );
            this.authService.setCookie('ville1', this.authService.sessions.ville, dtExpire, '/', null, null );
            this.authService.setCookie('online1', this.authService.sessions.online, dtExpire, '/', null, null );
            this.authService.setCookie('etat1', this.authService.sessions.etat, dtExpire, '/', null, null );
            this.authService.setCookie('darkmode1', 0, dtExpire, '/', null, null );
            if (this.authService.sessions.etat === '1') {
              this.authService.sessions.nom = 'Anonyme';
              this.authService.sessions.prenom = 'Utilisateur';
              this.authService.sessions.photo = 'ic_profile_anonymous.png';
              this.authService.setCookie('nom1', 'Anonyme', dtExpire, '/', null, null );
              this.authService.setCookie('prenom1',  'Utilisateur', dtExpire, '/', null, null );
              this.authService.setCookie('photo1','ic_profile_anonymous.png', dtExpire, '/', null, null );
            } else {
              this.authService.setCookie('nom1', this.authService.sessions.nom, dtExpire, '/', null, null );
              this.authService.setCookie('prenom1', this.authService.sessions.prenom, dtExpire, '/', null, null );
              this.authService.setCookie('photo1', this.authService.sessions.photo, dtExpire, '/', null, null );
            }
          } else {
            this.authService.isAuth = false;
            this.afficher_spinner = false;
            this.openSnackBar('Vous avez entre le mauvais Login ou mot de passe', 'erreur');
          }
          return response;
        },
        (error) => {
          this.afficher_spinner = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
        }
      );
  }

  switchinscript() {
    this.router.navigate(['inscript']);
  }

}
