import { Component, OnInit, Directive,Input   } from '@angular/core';
import { NgModule } from '@angular/core';  
import { FormGroup, FormBuilder, Validators, EmailValidator, NgForm, FormControl,ValidationErrors   } from '@angular/forms';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  //private loginForm: FormGroup;
  private myGroup: FormGroup;
  //myform: FormGroup;
  email: FormControl;
  password: FormControl;
  public errorMsg: string;
  authenticationFlag: boolean = true;
  public responseData: any;
  public error:boolean=false;
  public userPostData = {
    'email': '',
    'password':''
  }; 
    
  constructor( private authService: AuthService,private router: Router) {}  
  ngOnInit() { 
    this.createFormControls();
    this.createForm();
    this.errorMsg = ''; 
    this.authService.logout();    
        
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
    
  }

  createForm() {
    this.myGroup = new FormGroup({
      email: this.email,
      password: this.password      
    });
  }

onSubmit(){
      if (this.myGroup.valid) {
       
        this.userPostData.email = this.myGroup.value.email;
        this.userPostData.password = this.myGroup.value.password;
        this.errorMsg = '';
        this.authService.login(this.myGroup.value.email, this.myGroup.value.password).subscribe(auth =>{
          if(auth) {
           // console.log('success case' + auth);
            this.router.navigate(['/home']);
          }else{
            this.error = true;
          }
        });
        
      }
  }


  logout(){
    localStorage.clear();
    localStorage.removeItem('auth');
    this.router.navigate(['']);
  }



}
