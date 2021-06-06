import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable()

export class LoadingService {
  private loadingSub = new Subject<boolean>();
  loading$: Observable<boolean> = this.loadingSub.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T>{
    return null!;
    // return undefined;
  }

  loadingOn(){
    this.loadingSub.next(true);
  }

  loadingOff(){
    this.loadingSub.next(false);
  }
}
