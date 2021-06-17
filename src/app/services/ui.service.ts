import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Category} from "../models/category.model";

@Injectable({
  providedIn: "root"
})

export class UiService {
  isPlayer = false;
  categorySub = new Subject<Category>();
  searchTextSub = new Subject<string>();
  isPlayerSub = new Subject<boolean>();
}
