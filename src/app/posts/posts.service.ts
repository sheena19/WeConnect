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
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    //FormData allow us to send text and file value to send which json does not allow
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title); //title is passed coz it will be used in image naming
    this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        console.log(responseData);
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        console.log(post);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); //this will update the post when added, which overcomes reference in array
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      //as a new image
      const postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      //as a image
      const postData: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        const updatedPosts = {...this.posts};
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
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
