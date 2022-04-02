import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConstantsService } from 'src/app/services';
import { DeviceDetectorService } from 'src/app/services/device-detector/device-detector.service';
import { ProfileService } from '../../services';
import { CustomSocket } from '../../sockets/custom-socket';

@Component({
  selector: 'app-private-pages-container',
  templateUrl: './private-pages-container.component.html',
  styleUrls: ['./private-pages-container.component.scss']
})
export class PrivatePagesContainerComponent implements OnInit, OnDestroy {

  isMobileSize: boolean;
  subscription: Subscription;

  constructor(
    private socket: CustomSocket,
    private constantsService: ConstantsService,
    private profileService: ProfileService,
    private deviceDetectorService: DeviceDetectorService
  ) { 
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    const userDisconnectedSubscription =
      this.socket.fromEvent<any>(this.constantsService.SOCKET_FROM_USER_DISCONNECTED).pipe(
      ).subscribe(() => {
        this.profileService.logOut();
      });
    this.subscription.add(userDisconnectedSubscription);

    const isMobileSubscription =
      this.deviceDetectorService.isMobileSizeObservable().subscribe(isMobileSize =>
        this.isMobileSize = isMobileSize
      );
    this.subscription.add(isMobileSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
