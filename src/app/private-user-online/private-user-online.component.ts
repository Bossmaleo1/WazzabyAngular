import {Component, Input, OnInit} from '@angular/core';
import {PrivateUseronlineServices} from '../Services/private.useronline.services';
@Component({
  selector: 'app-private-user-online',
  templateUrl: './private-user-online.component.html',
  styleUrls: ['./private-user-online.component.scss']
})
export class PrivateUserOnlineComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() user_photo: string;
  @Input() indexOfConvert: number;

  constructor(private privateuseronlineservices: PrivateUseronlineServices) { }

  ngOnInit() {
  }

}
