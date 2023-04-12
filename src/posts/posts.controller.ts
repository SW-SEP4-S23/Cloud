import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatePostDto } from "~/posts/dto/create-post.dto";
import { PostsService } from "~/posts/posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(":id")
  findOne(id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}
