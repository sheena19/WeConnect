import {Component, OnDestroy, OnInit} from '@angular/core'; // to get the data from the output event of direct parent we had used output for it
import {Subscription} from "rxjs";

import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {PageEvent} from "@angular/material";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pagesSizeOption = [1, 2, 5, 10];
  private postsSub: Subscription;

  //anytime the component is call this will be called
  constructor(public postsService: PostsService) {
  } //public will automatically create a new property name postsService which stores the incoming value in it

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  //unsubscribe when not need to be on DOM or when we go to another page
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
