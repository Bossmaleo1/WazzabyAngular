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
  icon: string;

  constructor(public problematiqueitemservice: ProblematiqueItemService
    , private httpClient: HttpClient
    , private authService: AuthService
    , public snackBar: MatSnackBar
    , private constance: ConstanceService
    , public  router: Router) { }

  ngOnInit() {
    /*console.log(this.index);
    console.log(this.id);
    console.log(this.name);*/

    //console.log(this.problematiqueitemservice.Libelle);
    this.icon = 'subject';

    //shall we test if the problematiques list exist
    //if problematiques list exists it's does it means we are in the component problematiquesdetails
    if (typeof this.problematiqueitemservice.problematiques != 'undefined') {

      //shall we test if the language it's french and the problematique sport
      if (this.problematiqueitemservice.problematiques[0].Lang === 'fr' && this.problematiqueitemservice.Libelle === 'Sport') {
        //console.log(this.id);
        if (this.name === 'Football' ) {
            this.icon = 'sports_soccer';
        } else if (this.name === 'Tennis') {
          this.icon = 'sports_tennis';
        } else if (this.name === 'Rugby') {
          this.icon = 'sports_rugby';
        } else if (this.name === 'Basketball') {
          this.icon = 'sports_basketball';
        } else if (this.name === 'Volley') {
          this.icon = 'sports_volleyball';
        } else if (this.name === 'MMA') {
          this.icon = 'sports_mma';
        } else if (this.name === 'Esport') {
          this.icon = 'sports_esports';
        } else if (this.name === 'Baseball') {
          this.icon = 'sports_baseball';
        } else if (this.name === 'Judo') {
          this.icon = 'sports_kabaddi';
        } else if (this.name === 'Handball') {
          this.icon = 'sports_handball';
        } else if (this.name === 'Golf') {
          this.icon = 'sports_golf';
        } else if (this.name === 'Football Americain') {
          this.icon = 'sports_football';
        } else if (this.name === 'MotorSport') {
          this.icon = 'sports_motorsports';
        } else if (this.name === 'Natation') {
          this.icon = 'pool';
        } else if (this.name === 'Cyclisme') {
          this.icon = 'subject';
        } else if (this.name === 'Cricket') {
          this.icon = 'sports_cricket';
        } else if (this.index === 16) {
          this.icon = 'sports_cricket';
        } else if (this.name === 'Hockey') {
          this.icon = 'sports_hockey';
        }

      }
    }

    if (this.problematiqueitemservice.problematiquescat[0].Lang === 'fr') {
      if (typeof this.problematiqueitemservice.problematiquescat[this.index] != 'undefined') {

        if (this.problematiqueitemservice.problematiquescat[this.index].Libelle === 'Sport') {
          this.icon = 'sports';
        }

        if (this.problematiqueitemservice.problematiquescat[this.index].Libelle === 'Musique') {
            this.icon = 'music_note';
        }

        if (this.problematiqueitemservice.problematiquescat[this.index].Libelle === 'Méloncolique') {
          this.icon = 'mood_bad';
        }

        if (this.problematiqueitemservice.problematiquescat[this.index].Libelle === 'Fête/Céremonie/Evénement') {
          this.icon = 'event';
        }

        if (this.problematiqueitemservice.problematiquescat[this.index].Libelle === 'Business') {
          this.icon = 'timeline';
        }


      }

    }

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
