import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { TokenStorage } from "../guard/token-storage";
import { LogService } from "../services/log.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { ErrorService } from "../services/error.service";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: TokenStorage,
    private log: LogService,
    private injector: Injector
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const errorService = this.injector.get(ErrorService);
    const notifier = this.injector.get(NotificationService);

    let message: any;

    this.log.info("AuthInterceptor called ...");
    // Get the auth token from the service.
    const authToken = this.auth.getToken();
    this.log.info("Token " + authToken);

    if(req.url === 'https://developer.nstoolz.com/api/ipkit/?ip=172.232.124.68' || req.url === 'https://www.cloudflare.com/cdn-cgi/trace') {
      console.log("CALL")
      return next.handle(req)
    }
    else
    {
    // Clone the request and set the new header in one step.
    const authReq = req.clone({
      setHeaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken
      }
    });

    this.log.info("Bearer " + authToken);
    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        message = errorService.getServerErrorMessage(error);
        //stackTrace = errorService.getServerErrorStackTrace(error);
        notifier.showError(message);
        if (error.status === 401) {
          // refresh token
        } else {
          return throwError(error);
        }
      })
    );
    }



  }
}
