import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../Services/auth.service';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ConstanceService} from '../Services/Constance.service';

@Component({
  selector: 'app-welcome-to-wazzaby',
  templateUrl: './welcome-to-wazzaby.component.html',
  styleUrls: ['./welcome-to-wazzaby.component.scss']
})
export class WelcomeToWazzabyComponent implements OnInit {

  constructor(private  router: Router
    , private authService: AuthService
    , private _location: Location
    , private httpClient: HttpClient
    , private constance: ConstanceService) { }

  ngOnInit() {
  }

  OnNext() {
    this.router.navigate(['problematique']);
  }

}
