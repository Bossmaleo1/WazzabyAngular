

export class ConstanceService {



  dns = 'http://localhost:8000';
  dns1 = 'http://localhost';

  /*dns = 'http://wazzaby.com/WazzabyApi/public';
  dns1 = 'http://wazzaby.com';*/
  ///WazzabyApi/public
  name_file: any;
  //pour tester la photo
  test_updatecachephoto = 1;
  //pour stocker la liste des messages public
  messagepublicobject: any;

  //les variables pour la gestion de changements d'images utilisateurs
  disabled_example_card: boolean = true;

  backgroundcolor: string = '#F5F5F5';
  primary_color: string = '#448AFF';
  text_color: string = 'white';
  cardview_background: string = 'white';
  cardview_textcolor: string = '#212121';

  background_message_error: string = 'white';

  background_dialog_message_public_edit: string = 'white';
  text_color_dialog_message_public = '#212121';
  icon_dark_mode_color: string = 'white';
  background_menu_item_home_dark_mode : string = 'white';

  getDNS() {return this.dns;
  }

  setDNS(dns: string) {this.dns = dns;
  }

  //on implemente la méthode qui redirectionne les utilisateurs vers la page de télechargement lorsqu'ils sont sur mobile
  RedirectToDownloadPage() {
    if (navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
      //undisplayIconForMobile();
      document.location.href = this.dns1.concat("/download");
    }
  }

}
