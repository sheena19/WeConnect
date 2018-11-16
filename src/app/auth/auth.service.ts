import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {stripGeneratedFileSuffix} from "@angular/compiler/src/aot/util";
import {Subject} from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  constructor(private http: HttpClient) {}

  private authListener = new Subject<boolean>();

  getToken(){
    return this.token;
  }

  getAuthListener(){
    return this.authListener.asObservable();
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
    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.authListener.next(true);
      })
  }
}
