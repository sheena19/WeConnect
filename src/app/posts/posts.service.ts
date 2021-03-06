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
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    // `` this in javascript lets you add value dynamically
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      // we are using map here to map the id with _id of database
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
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
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
