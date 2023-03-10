import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/_core/services/authentication.service';
import { ReactiveFormsService } from 'src/app/_core/services/reactive-forms.service';
import { TokenService } from 'src/app/_core/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  private subs = new Subscription();


  constructor( private fb : FormBuilder,
    private authenticationService : AuthenticationService,
    private tokenService: TokenService,
    private router: Router,
    private reactiveFormsService: ReactiveFormsService
    ) { }

  ngOnInit(): void {
    this.creationLoginForm()
  }


creationLoginForm(){
  this.loginFormGroup = this.fb.group({
    username:[null, Validators.required],
    password:[null, Validators.required]
  })
}

onSubmit(){
  if(this.loginFormGroup.valid){
     this.subs.add(
     this.authenticationService.Login(this.loginFormGroup.value , 
      {skip_token: 'true'}).subscribe((response)=>{
        console.log(response)
        this.handelToken(response);
     })
  )
  }else{
    this.reactiveFormsService.validateAllFormFields(this.loginFormGroup);

  }
 

}

 /**
   * handling the token From the backEnd
   */
 handelToken(response: any) {
  this.tokenService.handle(response);
  if (this.tokenService.loggedIn()) {
    this.router.navigateByUrl('/notes');
  }
}

  

}
