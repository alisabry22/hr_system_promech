import {inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { LoginService } from './login.service';
import { first, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService=inject(LoginService);
  const router=inject(Router);



  return loginService.isLoggedIn.pipe(
    first(),
    map(isLoggedIn=>{
      console.log(`authGuard ${isLoggedIn} `);


      if(!isLoggedIn){

       router.navigate(['login']);
        return false;
      }else{

       router.navigate(['dashboard']);
        return true;
      }
    })
  );


};

