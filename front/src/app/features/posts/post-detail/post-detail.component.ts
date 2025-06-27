import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';
import { CommentService } from 'src/app/services/comment.service';
import { Post, Comment } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  comments: Comment[] = [];
  commentForm!: FormGroup;
  isSubmittingComment = false;
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createCommentForm();
    this.loadPost();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createCommentForm(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  loadPost(): void {
    const postId = this.route.snapshot.params['id'];
    if (!postId) {
      this.router.navigate(['/posts']);
      return;
    }

    this.postService.getPostById(+postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post) => {
          this.post = post;
          this.loadComments(+postId);
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'article', err);
        }
      });
  }

  loadComments(postId: number): void {

    this.commentService.getCommentsByPost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des commentaires', err);
        }
      });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid || !this.post?.id) {
      return;
    }

    this.isSubmittingComment = true;

    const commentData: Comment = {
      content: this.commentForm.value.content
    };

    this.commentService.createComment(this.post.id, commentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newComment) => {
          this.comments.push(newComment);
          this.commentForm.reset();
          this.isSubmittingComment = false;
        },
        error: (err) => {
          console.error('Erreur lors de la création du commentaire', err);
          this.isSubmittingComment = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
