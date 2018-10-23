import {Component} from '@angular/core'; // we add output decorator just to really make event listen from outside
import {NgForm} from "@angular/forms";
import {PostsService} from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

  constructor(public postsService: PostsService) {
  }

  onAddPost(form: NgForm) {
    if ((form.invalid)) {
      return;
    }
    this.postsService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }
}
