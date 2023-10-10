import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
     router=inject(Router);
    intercept(req: HttpRequest<any>,next: HttpHandler,): Observable<HttpEvent<any>> {

        const idToken = sessionStorage.getItem("token");

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned);
        }
        else {
           // this.router.navigate(['login']);
            return next.handle(req);
        }
    }
}
