import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Category} from "../models/category.model";

@Injectable({
  providedIn: "root"
})

export class UiService {
  tabSelectedIndexSub = new Subject<number>();
  categorySub = new Subject<Category>();
  categoriesSub = new Subject<Category[]>();
  searchTextSub = new Subject<string>();
  isPlayerSub = new Subject<boolean>();
  isCoursePurchased = new Subject<boolean>();
  loadingStateChanged = new Subject<boolean>();
}