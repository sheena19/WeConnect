import { Component, EventEmitter, Output } from '@angular/core'; // we add output decorator just to really make event listen from outside

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';

  @Output() postCreated = new EventEmitter();

  onAddPost() {
    const post = {
       title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
}
