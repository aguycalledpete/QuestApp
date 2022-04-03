import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { timeout, catchError, of, Subscription, delay } from 'rxjs';
import { ConstantsService } from 'src/app/services';
import { ProfileService } from '../../services';
import { CustomSocket } from '../../sockets/custom-socket';

@Component({
  selector: 'app-process-login',
  templateUrl: './process-login.component.html',
  styleUrls: ['./process-login.component.scss']
})
export class ProcessLoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private socket: CustomSocket,
    private constantsService: ConstantsService,
    private profileService: ProfileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    // set subscription for login confirmation on web socket
    const loginConfirmedSubscription =
      this.socket.fromEvent<boolean>(this.constantsService.SOCKET_FROM_LOGIN_CONFIRMED).pipe(
        timeout(10000),
        delay(500),
        catchError(() => of(false))
      ).subscribe(isLoginConfirmed => {
        if (!isLoginConfirmed) {
          this.profileService.logOut();
          return;
        }
        this.router.navigate(['../public-rooms'], { relativeTo: this.activatedRoute });
      });
    this.subscription.add(loginConfirmedSubscription);

    // send login request on web socket
    this.socket.emit(this.constantsService.SOCKET_TO_LOGIN);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
