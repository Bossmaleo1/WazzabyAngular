

export class PublicConvertServices {

  conversationsPublics: any;
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
