import {Component, Input, OnInit} from '@angular/core';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';

@Component({
  selector: 'app-privaterecentconvert',
  templateUrl: './privaterecentconvert.component.html',
  styleUrls: ['./privaterecentconvert.component.scss']
})
export class PrivaterecentconvertComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() user_photo: string;
  @Input() indexOfConvert: number;

  constructor(private privaterecentconvertservices: PrivateRecentconvertServices) { }

  ngOnInit() {

  }

}
