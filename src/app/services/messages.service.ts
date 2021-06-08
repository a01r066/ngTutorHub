import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, pipe} from "rxjs";
import {filter} from "rxjs/operators";

@Injectable()
export class MessagesService {
  private errorsSub = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.errorsSub.asObservable().pipe(filter(messages => messages && messages.length > 0));

  showErrors(...errors: string[]){
    this.errorsSub.next(errors);
  }
}
