
export class HomeDesignService {

  OnDesignTab(etat: boolean) {
    if (etat) {
      return 'blue';
    } else {
      return 'black';
    }
  }

}
