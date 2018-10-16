import {Component, OnDestroy, OnInit} from '@angular/core'; // to get the data from the output event of direct parent
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import {PostsService} from "../posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription;

  //anytime the component is call this will be called
  constructor(public postsService: PostsService){ } //public will automatically create a new property name postsService which stores the incoming value in it

  ngOnInit(){
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) =>{
      this.posts = posts;
    });
  }

  //unsubscribe when not need to be on DOM or when we go to another page
  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
