import {Component, Input, OnInit} from '@angular/core';
import {PublicCommentsServices} from '../Services/public.comments.services';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() id: number;
  @Input() name: string;
  @Input() updated: string;
  @Input() user_photo: string;
  @Input() status_text_content: string;
  @Input() indexOfConvert: number;

  constructor(private publiccomments: PublicCommentsServices) { }

  ngOnInit() {
  }

}
