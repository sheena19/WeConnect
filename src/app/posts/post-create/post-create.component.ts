import {Component, OnInit} from '@angular/core'; // we add output decorator just to really make event listen from outside
import {NgForm} from "@angular/forms";
import {PostsService} from "../posts.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Post} from "../post.model";
import {post} from "selenium-webdriver/http";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  post: Post;
  private mode = "create";
  postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    //in-built observable so we do not unsubscribe
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
