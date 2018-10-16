import { Post } from "./post.model";
import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs'; //can be used in replacement of EventEmitter, which has broader usecase

//it can also be added to providers array in app.module.ts
@Injectable({providedIn: 'root'}) //it can be available to all the elements from root.
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(){
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((postData)=> {
        this.posts = postData.posts;
        this.postsUpdated.next(([...this.posts]));
      });
/*
    return [...this.posts];
    this is used to extract all the elements from posts array and push it to the return array,
    hence by returning a reference posts array
    But this might cause an error saying that post array is initially empty and hence causes error to load after adding posts
    return this.posts;
  */
  }

  //postsUpdated is private and hence to listen we need a listener otherwise it can access the whole data
  //returns the object to which we can listen
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); //this will update the post when added, which overcomes reference in array
  }
}
