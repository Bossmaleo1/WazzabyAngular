

export class PublicConvertServices {

  conversationsPublics: any;
  //it's help with to make a lazy loading of my public message
  dateitem: any;
  //it's help me to stop my lazy loading
  countitem: any;

  itemobject: any;
  public_response: any;


  getPublicConversById(id: number) {
    /*const convert = this.conversationsPublics.find(
        (convertObject) => {
            return convertObject.id === id;
        }
    );*/
    return this.conversationsPublics[id];
  }

}
