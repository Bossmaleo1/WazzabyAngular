

export class PublicConvertServices {

  conversationsPublics: any;
  //it's help with to make a lazy loading of my public message
  dateitem: any;
  //it's help me to stop my lazy loading
  countitem: any;

  itemobject: any;
  public_response: any;
  publicconvert_id: any;
  libelle: any;
  anonyme: any;


  getPublicConversById(id: number) {

    return this.conversationsPublics[id];
  }

}
