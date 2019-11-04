import { Component, OnInit } from '@angular/core';
import {DateAdapter, MatSnackBar, PageEvent} from '@angular/material';
import {MyDateAdapter} from '../Services/MyDateAdapter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';
import {AuthService} from '../Services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-inscript-form',
  templateUrl: './inscript-form.component.html',
  styleUrls: ['./inscript-form.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MyDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'fr'}
  ]
})
export class InscriptFormComponent implements OnInit {

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  afficher_code = false;
  firstform1: any;
  nom: any;
  prenom: any;
  datedenaissance: any;
  sexe: any;
  password: any;
  hide1 = true;
  hide2 = true;
  //il s'agit de la chaîne de caractère qui s'affichera en cas d'erreur grâce au data biding
  error_email : string = '';
  //il s'agit de la chaîne de caractère qui s'affichera en cas d'erreur dans la confirmation du mot de passe par data biding
  error_password1 : string = '';
  error_password2 : string = '';
  //il s'agit de la chaîne de caractère qui s'affichera en cas d'erreur du prenom, nom ,date de naissance,sexe
  error_name : string = '';
  error_firstname : string;
  error_sex : string;
  error_birthday : string;
  disparaitreprogressbar = 'none';
  disparaitreallblock = 'block';

  constructor(private _formBuilder: FormBuilder
    , public snackBar: MatSnackBar
    , private authService: AuthService
    , private httpClient: HttpClient
    , private _location: Location
    , private  router: Router
    , private constance: ConstanceService) {}

  ngOnInit() {
    this.initForm();
  }

  OnBack() {
    this._location.back();
  }

  initForm() {
    this.firstFormGroup = this._formBuilder.group({
      email: ['',  [Validators.required, Validators.email]],
      codevalidation: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      Nom: ['', Validators.required],
      Prenom: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      sexe: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  onSubmitfirstForm(stepper: MatStepper) {
    const formValue = this.firstFormGroup.value;
    let email_boolean: boolean = false;
    //let email_value = formValue['email'];

    //on test par le biais d'une regex la validité d'un message d'erreur afin de contrôler l'affichage des messages d'erreur
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/.test(formValue['email']))
    {
      email_boolean = true;
      this.error_email = "";
    } else {
      email_boolean = false;
      this.error_email = "Votre email est incorrect !!";
    }

    if(this.afficher_code === false && email_boolean ===true)
    {
      //on lance la requête http pour vérifier la disponibilité de cette adresse email
      const url_email = this.constance.dns.concat('/api/VerificationEmail?email=').concat(formValue['email']);
      this.disparaitreprogressbar = 'block';
      this.disparaitreallblock = 'none';
      this.httpClient
        .get(url_email)
        .subscribe(
          (response) => {
            /*this.afficher_code = !this.afficher_code;
            this.firstform1 = response;*/
            let reponse:any;
            reponse = response;
            if(reponse.email ===1) {
              this.disparaitreprogressbar = 'none';
              this.disparaitreallblock = 'block';
              this.openSnackBar('Cette adresse email est déjà occupée !!', 'erreur');
            } else if (reponse.email === 0) {
              const url1 = this.constance.dns1.concat('/WazzabyApiOthers/send_mail.php?email=').concat(formValue['email']);
              this.httpClient
                .get(url1)
                .subscribe(
                  (response) => {
                    this.afficher_code = !this.afficher_code;
                    this.firstform1 = response;
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreallblock = 'block';
                  },
                  (error) => {
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreallblock = 'block';
                  }
                );
            }

          },
          (error) => {
            this.disparaitreprogressbar = 'none';
            this.disparaitreallblock = 'block';
            this.openSnackBar('Une erreur réseau vient de se produire', 'erreur');
          }
        );
    }

    if (this.afficher_code === true && email_boolean ===true) {
      if (this.firstform1.succes === formValue['codevalidation']) {
        stepper.next();
      } else {
        this.openSnackBar("Vous avez inserer un mauvais code de validation !!",'erreur');
      }
    }

  }


  onSubmitSecondForm(stepper: MatStepper) {
    const formValue = this.secondFormGroup.value;
    this.nom = formValue['Nom'];
    this.prenom = formValue['Prenom'];
    this.datedenaissance = formValue['date'];
    let test1 = false;
    let test2 = false;
    let test3 = false;
    if (this.nom.trim().length === 0) {
      this.error_name = 'Veuillez préciser votre nom';
      test1 = false;
    } else {
      this.error_name = '';
      test1 = true;
    }

    if (this.prenom.trim().length === 0) {
      this.error_firstname = 'Veuillez préciser votre prénom';
      test2 = false;
    } else {
      this.error_firstname = '';
      test2 = true;
    }

    const date = new Date(formValue['date']);
    const moi = +date.getMonth() + 1;
    const jour = date.getDate();
    const annee = +date.getFullYear();
    const anneefinale = jour.toString().concat('-').concat(moi.toString()).concat('-').concat(annee.toString());

    if (/^[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}$/.test(anneefinale)) {
      this.error_birthday = '';
      test3 = true;
    } else {
      this.error_birthday = 'Veuillez préciser votre date de naissance avec le bon format(JJ-MM-AAAA)';
      test3 = false;
    }

    if (test1 === true && test2 === true && test3 === true) {
      stepper.next();
    }

  }

  onSubmitthirdForm(stepper: MatStepper) {
    const formValue = this.thirdFormGroup.value;
    this.sexe = formValue['sexe'];
    this.password = formValue['password1'];
    const password2 = formValue['password2'];
    let test1 = false;
    let test2 = false;
    let test3 = false;

    if (this.sexe.trim().length === 0) {
      this.error_sex = 'Veuillez préciser votre sexe';
      test1 = false;
    } else {
      this.error_sex = '';
      test1 = true;
    }

    if (this.password.trim().length >= 8) {
        this.error_password1 = '';
        test2 = true;
    } else {
      this.error_password1 = 'Votre mot de passe ne doit pas faire moins de 8 caractères';
      test2 = false;
    }

    if (password2 != this.password) {
      this.error_password2 = 'Le mot de passe de confirmation ne correspond au mot de passe saisie';
      test3 = false;
    } else {
      this.error_password2 = '';
      test3 = true;
    }

    if (test1 === true && test2 === true && test3 === true) {
      this.disparaitreprogressbar = 'block';
      this.disparaitreallblock = 'none';
      const date = new Date(this.datedenaissance);
      const moi = +date.getMonth() + 1;
      const jour = date.getDate();
      const annee = +date.getFullYear();
      const anneefinale = annee.toString().concat('-').concat(moi.toString()).concat('-').concat(jour.toString());
      const url = this.constance.dns.concat('/api/insertUsers?email=').concat(this.firstform1.email).concat('&codedevalidation=').concat(this.firstform1.succes).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe).concat('&password=').concat(this.password).concat('&date=').concat(anneefinale);
      this.httpClient
        .get(url)
        .subscribe(
          (response) => {
            this.authService.sessions = response;
            this.authService.sessions.email = this.firstform1.email;
            this.authService.sessions.password = this.password;
            this.constance.test_updatecachephoto = 3;
            let dtExpire = new Date();
            dtExpire.setTime(dtExpire.getTime() + ( 1000 * 2 * 365 * 24 * 60 * 60));
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
            this.authService.setCookie('nom1', this.authService.sessions.nom, dtExpire, '/', null, null );
            this.authService.setCookie('prenom1', this.authService.sessions.prenom, dtExpire, '/', null, null );
            this.authService.setCookie('photo1', this.authService.sessions.photo, dtExpire, '/', null, null );

            this.openSnackBar(" Votre Inscription s'est effectuee avec succes ! ", 'succes');
            const url1 = this.constance.dns1.concat('/WazzabyApiOthers/send_welcome_mail.php?email=').concat(this.firstform1.email).concat('&password=').concat(this.password).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe);
            this.httpClient
              .get(url1)
              .subscribe(
                (response1) => {
                  this.afficher_code = !this.afficher_code;
                  this.authService.isAuth = true;
                  this.authService.isAuth = true;
                  this.constance.test_updatecachephoto = 3;
                  this.router.navigate(['profil']);
                  //this.constance.test_updatecachephoto = 3;

                },
                (error) => {
                  this.openSnackBar(" Une erreur serveur vient de se produire ! ", 'erreur');
                  this.disparaitreprogressbar = 'none';
                  this.disparaitreallblock = 'block';
                });


          },
          (error) => {
            this.disparaitreprogressbar = 'none';
            this.disparaitreallblock = 'block';
            this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
          }
        );
    }

    /*this.disparaitreprogressbar = 'block';
    this.disparaitreallblock = 'none';
    const date = new Date(this.datedenaissance);
    const moi = +date.getMonth() + 1;
    const jour = date.getDate();
    const annee = +date.getFullYear();
    const anneefinale = annee.toString().concat('-').concat(moi.toString()).concat('-').concat(jour.toString());
    const url = this.constance.dns.concat('/WazzabyApi/public/api/insertUsers?email=').concat(this.firstform1.email).concat('&codedevalidation=').concat(this.firstform1.succes).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe).concat('&password=').concat(this.password).concat('&date=').concat(anneefinale);
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          this.authService.sessions = response;
          this.authService.sessions.email = this.firstform1.email;
          console.log(this.password);
          this.authService.sessions.password = this.password;
          this.constance.test_updatecachephoto = 3;
          this.openSnackBar(" Votre Inscription s'est effectuee avec succes ! ", 'succes');
          const url1 = this.constance.dns.concat('/WazzabyApiOthers/send_welcome_mail.php?email=').concat(this.firstform1.email).concat('&password=').concat(this.password).concat('&nom=').concat(this.nom).concat('&prenom=').concat(this.prenom).concat('&sexe=').concat(this.sexe);
          this.httpClient
            .get(url1)
            .subscribe(
              (response1) => {
                this.afficher_code = !this.afficher_code;
                this.authService.isAuth = true;
                this.authService.isAuth = true;
                this.constance.test_updatecachephoto = 3;
                //this.constance.test_updatecachephoto = 3;
                this.router.navigate(['welcome']);

              },
              (error) => {
                this.openSnackBar(" Une erreur serveur vient de se produire ! ", 'erreur');
                this.disparaitreprogressbar = 'none';
                this.disparaitreallblock = 'block';
              }

            );



        },
        (error) => {
          this.disparaitreprogressbar = 'none';
          this.disparaitreallblock = 'block';
          this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
        }
      );*/


  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
