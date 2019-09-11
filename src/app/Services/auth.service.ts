
export class AuthService {
  isAuth = false;
  sessions: any;
  inscript_user: any;
  etat_problematique = true;

  signIn() {
    this.isAuth = true;
  }

  signOut() {
    this.isAuth = false;
    let dtExpireDel = new Date();
    dtExpireDel.setTime(dtExpireDel.getTime() - 1);
    this.setCookie('libelle_prob1', '', dtExpireDel,'/', null, null);
    this.setCookie('nom1', '', dtExpireDel, '/', null, null );
    this.setCookie('prenom1', '', dtExpireDel, '/', null, null );
    this.setCookie('email1', '', dtExpireDel, '/', null, null );
    this.setCookie('id1', '',dtExpireDel,'/',null,null);
    this.setCookie('id_prob1', '', dtExpireDel, '/', null, null );
    this.setCookie('keypush1','', dtExpireDel, '/', null, null );
    this.setCookie('langue1', '', dtExpireDel, '/', null, null );
    this.setCookie('pays1', '', dtExpireDel, '/', null, null );
    this.setCookie('datenaissance1','', dtExpireDel, '/', null, null );
    this.setCookie('sexe1', '', dtExpireDel, '/', null, null );
    this.setCookie('ville1', '', dtExpireDel, '/', null, null );
    this.setCookie('photo1', '', dtExpireDel, '/', null, null );
    this.setCookie('online1', '', dtExpireDel, '/', null, null );
  }

  getSessions() {
    return this.sessions;
  }

  setCookie(nom, valeur, expire, chemin, domaine, securite) {
    document.cookie = nom + ' = ' + escape(valeur) + '  ' +
      ((expire == undefined) ? '' : ('; expires = ' + expire.toGMTString())) +
      ((chemin == undefined) ? '' : ('; path = ' + chemin)) +
      ((domaine == undefined) ? '' : ('; domain = ' + domaine)) +
      ((securite == true) ? '; secure' : '');
  }

  getCookie(name) {
    if (document.cookie.length == 0)
      return null;

    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);

    for(var i = 0; i < cookies.length; i++){
      var regInfo = new RegExp('=', 'g');
      var infos = cookies[i].split(regInfo);
      if(infos[0] == name){
        return unescape(infos[1]);
      }
    }
    return null;
  }

}
