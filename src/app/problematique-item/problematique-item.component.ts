import {Component, Input, OnInit} from '@angular/core';
import {ProblematiqueItemService} from '../Services/problematique.item.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {AuthService} from '../Services/auth.service';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-problematique-item',
  templateUrl: './problematique-item.component.html',
  styleUrls: ['./problematique-item.component.scss']
})
export class ProblematiqueItemComponent implements OnInit {

  @Input() index: number;
  @Input() id: number;
  @Input() name: string;

  constructor(public problematiqueitemservice: ProblematiqueItemService
    , private httpClient: HttpClient
    , private authService: AuthService
    , public snackBar: MatSnackBar
    , private constance: ConstanceService
    , public  router: Router) { }

  ngOnInit() {
  }

  OnDetailsProb() {
    if (this.problematiqueitemservice.testprobcomponent === 1) {
      this.problematiqueitemservice.switchOnOne(this.index, this.id, this.name);
      this.router.navigate(['details']);
    } else if (this.problematiqueitemservice.testprobcomponent === 2) {
      //this.problematiqueitemservice.afficher_spinner = true;
      this.problematiqueitemservice.afficher_spinner_after_changed_prob = true;
      this.problematiqueitemservice.afficher_spinner_probgen = false;
      this.problematiqueitemservice.afficher_block_problematique = false;
      const  url = this.constance.dns.concat('/api/changeproblematique?ID=').concat(this.authService.sessions.id).concat('&ID_prob=').concat(String(this.id));
      this.connexionToServer(url);
    }
  }

  connexionToServer(url: string) {
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.authService.sessions.id_prob = this.id;
          this.authService.sessions.libelle_prob = this.name;
          let dtExpire = new Date();
          dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
          this.authService.setCookie('id_prob1', this.id, dtExpire, '/', null, null );
          this.authService.setCookie('libelle_prob1', this.name, dtExpire, '/', null, null );
          this.problematiqueitemservice.afficher_spinner_probgen = false;
          this.openSnackBar("Votre problematique vient d'etre avec succes", 'succes');
          this.problematiqueitemservice.afficher_spinner_after_changed_prob = false;
          this.router.navigate(['home']);
        },
        (error) => {
          this.problematiqueitemservice.afficher_spinner_after_changed_prob = false;
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
