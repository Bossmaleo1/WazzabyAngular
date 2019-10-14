
export class ConstanceService {

  /*dns = 'http://localhost:8000';
  dns1 = 'http://localhost';*/

  dns = 'http://wazzaby.com/WazzabyApi/public';
  dns1 = 'http://wazzaby.com';
  ///WazzabyApi/public
  name_file: any;
  //pour tester la photo
  test_updatecachephoto = 1;
  //pour stocker la liste des messages public
  messagepublicobject: any;

  getDNS() {return this.dns;
  }

  setDNS(dns: string) {this.dns = dns;
  }
}
