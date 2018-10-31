import {Post} from "./post.model";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Subject} from 'rxjs'; //can be used in replacement of EventEmitter, which has broader usecase
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";

//it can also be added to providers array in app.module.ts
@Injectable({providedIn: 'root'}) //it can be available to all the elements from root.
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      // we are using map here to map the id with _id of database
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
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
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // used in post-create.component to
  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        console.log(responseData.message);
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); //this will update the post when added, which overcomes reference in array
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response =>{
        const updatedPosts = {...this.posts};
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); // informing everyone that post is now updated
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
