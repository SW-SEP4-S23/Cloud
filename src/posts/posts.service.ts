import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostDto } from "~/posts/dto/create-post.dto";
import { Post } from "~/posts/post.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepo: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    return this.postsRepo.save(createPostDto);
  }

  findAll() {
    return this.postsRepo.find();
  }

  findOne(id: number) {
    return this.postsRepo.findOneBy({ id });
  }

  async remove(id: number) {
    await this.postsRepo.delete(id);
  }
}
