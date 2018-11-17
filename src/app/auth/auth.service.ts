import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {stripGeneratedFileSuffix} from "@angular/compiler/src/aot/util";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class AuthService {
  private token: string;
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  private authStatusListener = new Subject<boolean>();

  getToken() {
    return this.token;
  }

  getAuthListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
