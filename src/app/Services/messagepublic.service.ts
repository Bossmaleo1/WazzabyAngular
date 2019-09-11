import {MessagePublic} from '../models/MessagePublic.model';
import {Subject} from 'rxjs';


export class MessagepublicService {

  private messagepublic: MessagePublic;
  messageSubject = new Subject<MessagePublic>();

  emitMessage() {
    this.messageSubject.next(this.messagepublic);
  }

}
