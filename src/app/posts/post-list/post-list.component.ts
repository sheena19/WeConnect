import {Component, OnDestroy, OnInit} from '@angular/core'; // to get the data from the output event of direct parent we had used output for it
import {Subscription} from "rxjs";

import {Post} from "../post.model";
import {PostsService} from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  //anytime the component is call this will be called
  constructor(public postsService: PostsService) {
  } //public will automatically create a new property name postsService which stores the incoming value in it

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  //unsubscribe when not need to be on DOM or when we go to another page
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
