export class ProblematiqueItemService {

  problematiques: any;
  problematiquescat: any;
  Id: any;
  Libelle: any;
  testprobcomponent: any;
  afficher_spinner = false;
  //display the shimmer placeholder before the data will arrive
  afficher_spinner_probgen = false;
  //display the spinner after the user would like to change the problematique
  afficher_spinner_after_changed_prob = false;
  //display the block of the problematique details after the shimmer placeholder
  afficher_block_problematique = false;
  //display the error message if we have network error
  afficher_network_error = false;

  switchOnOne(i: number, Idprob: number, libelle: any) {
    this.Id = Idprob;
    this.Libelle = libelle;
  }



}
