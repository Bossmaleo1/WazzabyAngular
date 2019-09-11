import {FormGroup} from '@angular/forms';

export class UpdateService {
  /*le status du block de la boite de dialogue*/
  block_boite_de_dialogue: string;
  disparaitreimage: string = 'none';
  disparaitreprogressbar: string = 'none';
  messagepublicform: FormGroup;
  disparaitrechamp: string = 'block';
  imageSrc: any;
  libellemessagepublic: string = '';
  photo_value: any;
  libelle_photo: string = '';
  dialog_update_or_display: boolean = false;
  id_message_public: number;
  indexOf: number;
  imagenamefordelete: string;
  id_photo: any;
}
