import {Component, HostListener, OnInit} from '@angular/core';
import {User} from "./models/user.model";
import {Category} from "./models/category.model";
import {Router} from "@angular/router";
import {UiService} from "./services/ui.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatDialog} from "@angular/material/dialog";
import {HomeDialogComponent} from "./home/home-dialog/home-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user!: User;
  isPlayer = false;
  isSideBarHidden = false;
  deviceInfo!: any;
  isDisable = false;

  constructor(
              private router: Router,
              private uiService: UiService,
              private deviceService: DeviceDetectorService,
              public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.epicFunction();

    this.uiService.isPlayerSub.subscribe(isPlayer => {
      this.isPlayer = isPlayer;
    })

    this.uiService.categorySub.subscribe(category => {
      this.onClickMenu(category);
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = window.innerWidth;
    this.isSideBarHidden = width < 800;
  }

  onClickMenu(event: Category){
    this.router.navigate(['courses', event.slug]);
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
    if(isMobile){
      this.showHomeDialog();
      this.isDisable = true;
    }
  }

  showHomeDialog() {
    const dialogRef = this.dialog.open(HomeDialogComponent, {
      width: '50vw',
      data: {},
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      window.addEventListener('contextmenu', (e) => {
        // do something here...
        e.preventDefault();
      }, false);
    });
  }
}
