import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {concatMap, finalize, tap} from "rxjs/operators";

@Injectable()

export class LoadingService {
  private loadingSub = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSub.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T>{
    return of(null)
      .pipe(
        tap(() => this.loadingOn()), // side effect
        concatMap(() => obs$), // emit to obs$
        finalize(() => this.loadingOff()));
  }

  loadingOn(){
    this.loadingSub.next(true);
  }

  loadingOff(){
    this.loadingSub.next(false);
  }
}
