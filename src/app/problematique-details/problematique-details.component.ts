import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {ProblematiqueItemService} from '../Services/problematique.item.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-problematique-details',
  templateUrl: './problematique-details.component.html',
  styleUrls: ['./problematique-details.component.scss']
})
export class ProblematiqueDetailsComponent implements OnInit {

  libelle_catprob = "";

  constructor(private  router: Router
    , private authService: AuthService
    , private _location: Location
    , public snackBar: MatSnackBar
    , private httpClient: HttpClient
    , private constance: ConstanceService
    , public problematiqueitemservice: ProblematiqueItemService) { }

  ngOnInit() {
    const url = this.constance.dns.concat('/api/displayproblematique?ID=').concat(this.problematiqueitemservice.Id);
    this.problematiqueitemservice.afficher_spinner_probgen = true;
    this.problematiqueitemservice.afficher_block_problematique = false;
    this.connexionToServer(url);
    this.problematiqueitemservice.testprobcomponent = 2;
    //console.log(this.problematiqueitemservice);
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
          this.problematiqueitemservice.problematiques  = response;
          this.problematiqueitemservice.afficher_spinner_probgen = false;
          this.problematiqueitemservice.afficher_block_problematique = true;
          //console.log(this.problematiqueitemservice.problematiques);
        },
        (error) => {
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          this.problematiqueitemservice.afficher_spinner_probgen = false;
        }
      );
  }



  OnBack() {
    this._location.back();
  }

  OnDeconnect() {
    this.authService.signOut();
    this.router.navigate(['connexion']);
  }

  onSearchProb(event) {
    const url = this.constance.dns.concat('/api/searchproblematique?ID=').concat(this.problematiqueitemservice.Id).concat('&libelle=').concat(this.libelle_catprob);
    this.connexionToServer(url);
  }

}
