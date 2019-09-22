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

}
