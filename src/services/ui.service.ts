import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Category} from "../app/models/category.model";

@Injectable({
  providedIn: "root"
})

export class UiService {
  tabSelectedIndexSub = new Subject<number>();
  categorySub = new Subject<Category>();
  categoriesSub = new Subject<Category[]>();
}
