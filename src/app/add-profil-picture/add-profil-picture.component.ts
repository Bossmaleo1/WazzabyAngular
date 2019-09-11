import { Component, OnInit,ViewChild, Inject, Renderer2, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import {AddProfilPictureService} from '../Services/add.profil.picture.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConstanceService} from '../Services/Constance.service';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../Services/auth.service';
import {MatSnackBar} from '@angular/material';

import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { LyResizingCroppingImages, ImgCropperConfig, ImgCropperEvent } from '@alyle/ui/resizing-cropping-images';
import { styles } from './app.styles';

@Component({
  selector: 'app-add-profil-picture',
  templateUrl: './add-profil-picture.component.html',
  styleUrls: ['./add-profil-picture.component.scss']
})
export class AddProfilPictureComponent implements OnInit {

  classes = this.theme.addStyleSheet(styles);
  croppedImg: string;
  @ViewChild(LyResizingCroppingImages, {static: false}) imgCropper: LyResizingCroppingImages;
  scale: number;
  myConfig: ImgCropperConfig = {
    width: 150,
    height: 150,
    fill: '#ff2997'
  };


  addphotoform: FormGroup;
  imageSrc: any;
  filevalue: any;
  disparaitreprogressbar: any;
  disparaitreblock: any;
  blockcroping = 'none';
  notreimage = 'inline-block';

  constructor(private addprofilpictureservice: AddProfilPictureService
    , private formBuilder: FormBuilder
    , private constance: ConstanceService
    , private httpClient: HttpClient
    ,private theme: LyTheme2
    , public snackBar: MatSnackBar
    , private authService: AuthService) { }

  ngOnInit() {
    if (this.constance.test_updatecachephoto === 1) {
      if (this.authService.getSessions().photo === '') {
        this.imageSrc = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile_colorier.png');
      } else {
        this.imageSrc = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
      }
    } else if (this.constance.test_updatecachephoto === 2) {
      this.imageSrc = this.authService.getSessions().photo;
    } else if (this.constance.test_updatecachephoto === 3) {
      if (this.authService.getSessions().photo === '') {
        this.imageSrc = this.constance.dns1.concat('/uploads/photo_de_profil/').concat('ic_profile_colorier.png');
      } else {
        this.imageSrc = this.constance.dns1.concat('/uploads/photo_de_profil/').concat(this.authService.getSessions().photo);
      }
    }
    this.disparaitreprogressbar = 'none';
    this.disparaitreblock = 'block';
    this.initForm();
  }

  initForm() {
    this.addphotoform = this.formBuilder.group({
      tenantPhotoId: ''
    });
  }

  onpenFileBrowser(event: any) {
    /* _fileInput.click();*/
    event.preventDefault();
    let element: HTMLElement = document.getElementById('tenantPhotoId') as HTMLElement;
    element.click();
    this.notreimage = 'none';
    this.blockcroping = 'block';
    console.log(document.getElementById('tenantPhotoId'));
  }

  onChangeFile(event) {
    this.disparaitreprogressbar = 'block';
    this.disparaitreblock = 'none';

    const taille = event.target.files[0].name.split('.').length;
    const extension = event.target.files[0].name.split('.')[taille - 1].toLowerCase();


    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {

      let libelle_photo = 'photo_';
      libelle_photo = libelle_photo.concat(this.authService.sessions.id).concat('.').concat(extension);
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imageSrc = reader.result;

        reader.readAsDataURL(file);
        this.filevalue = file;
        console.log(file);
        const url = this.constance.dns.concat('/api/updatelibelleuserphoto?id_user=').concat(this.authService.sessions.id).concat('&libelle_photo=').concat(libelle_photo);
        this.httpClient
          .get(url)
          .subscribe(
            (response) => {
              const url1 = this.constance.dns1.concat('/uploads/uploadPhotodeprofil.php');
              let formData: FormData = new FormData();
              formData.append('photostatus', this.filevalue);
              formData.append('name_file', libelle_photo);
              this.httpClient
                .post(url1, formData)
                .subscribe(
                  (response1) => {
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreblock = 'block';
                    if (this.constance.test_updatecachephoto != 3) {
                      this.constance.test_updatecachephoto = 2;
                      this.authService.sessions.photo = reader.result;
                    }
                    this.openSnackBar('Votre photo a ete mise a jour avec succes', 'succes');
                  },
                  (error) => {
                    this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                    this.disparaitreprogressbar = 'none';
                    this.disparaitreblock = 'block';
                  }
                );

              return response;
            },
            (error) => {

            }
          );

      }

    }

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onCrop(e: ImgCropperEvent) {
    this.croppedImg = e.dataURL;
    this.imageSrc = e.dataURL;
    this.disparaitreprogressbar = 'block';
    this.disparaitreblock = 'none';
    const extension = e.dataURL.split('/')[1].split(';')[0];
    let libelle_photo = 'photo_';
    libelle_photo = libelle_photo.concat(this.authService.sessions.id).concat('.').concat(extension);
    const url = this.constance.dns.concat('/api/updatelibelleuserphoto?id_user=').concat(this.authService.sessions.id).concat('&libelle_photo=').concat(libelle_photo);
    this.httpClient
      .get(url)
      .subscribe(
        (response) => {
          const url1 = this.constance.dns1.concat('/uploads/uploadPhotodeprofil.php');
          let formData: FormData = new FormData();
          formData.append('photostatus', this.dataURItoBlob(e.dataURL));
          formData.append('name_file', 'photo_'.concat(this.authService.sessions.id).concat('.').concat(e.dataURL.split('/')[1].split(';')[0]));
          this.httpClient
            .post(url1, formData)
            .subscribe(
              (response1) => {
                this.disparaitreprogressbar = 'none';
                this.disparaitreblock = 'block';
                if (this.constance.test_updatecachephoto != 3) {
                  this.constance.test_updatecachephoto = 2;
                }
                this.notreimage = 'inline-block';
                this.blockcroping = 'none';
                this.disparaitreprogressbar = 'none';
                this.disparaitreblock = 'block';
                this.authService.sessions.photo = e.dataURL;
                this.openSnackBar('Votre photo a ete mise a jour avec succes', 'succes');
              },
              (error) => {
                this.openSnackBar('Une erreur serveur vient de se produire', 'erreur');
                this.disparaitreprogressbar = 'none';
                this.disparaitreblock = 'block';
              }
            );

          return response;
        },
        (error) => {

        }
      );
  }
  /** manual crop */
  getCroppedImg() {
    const img = this.imgCropper.crop();
    console.log(img);
    return img.dataURL;
  }

  dataURItoBlob(dataURI) {

    let byteString = atob(dataURI.split(',')[1]);


    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }



    return new Blob([ab], {type: mimeString});


  }

}
