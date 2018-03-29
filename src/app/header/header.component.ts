import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    userLogged:boolean = false;
    loginLink:string= 'Login';
    loginRoute:string= 'login';
    
 
  constructor() { 
    //let Authvalue: string = localStorage.getItem("auth");
    //console.log("reading from localstorage:- "+ Authvalue);
    if(localStorage.getItem('auth')){
      //console.log("local valid: "+localStorage.getItem('auth'));
      this.userLogged = true;
      this.loginLink = 'Logout';
      this.loginRoute = 'logout';
      //console.log('link valid: '+this.loginLink);
    }else{
      //console.log("local invalid: "+localStorage.getItem('auth'));
      this.userLogged = false;
      this.loginLink = 'Login';
      this.loginRoute = 'login';
      //console.log('link test: '+this.loginLink);
    }
    
   }

  ngOnInit() { 
    //let Authvalue: string = localStorage.getItem("auth");
    //console.log('ngoninit: '+ Authvalue);
  }
 
  
}
