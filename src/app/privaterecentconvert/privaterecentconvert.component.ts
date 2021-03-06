import {Component, Input, OnInit} from '@angular/core';
import {PrivateRecentconvertServices} from '../Services/private.recentconvert.services';
import { BoshClient, $build } from "xmpp-bosh-client/browser";

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
      //console.log("Test du bossmaleo !!!");
      /*const USERNAME = 'admin@localhost';
      const PASSWORD = 'passw0rd';
      const URL = 'http://172.17.0.2:5280/http-bind/';
    const connection = new BoshClient(USERNAME, PASSWORD, URL);
      const client = new BoshClient(USERNAME, PASSWORD, URL);
    console.log(connection);

    client.on("online", () => {
      console.log("Connected successfully");
    });
    client.on("error", (e) => {
      console.log("Error event");
      console.log(e);
    });


    client.on("ping", () => {
      console.log(`Ping received at ${new Date()}`);
    });

    client.on("stanza", (stanza) => {
      console.log(`Stanza received at ${new Date()}`);
      console.log(stanza);
    });

    client.on("offline", () => {
      console.log("Disconnected/Offline");
    });

    client.connect();*/
  }

}
