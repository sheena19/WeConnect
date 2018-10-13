import {Component, Input} from '@angular/core'; // to get the data from the ouput event of direct parent
import { Post } from "../post.model";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  @Input() posts: Post[] = []
}
