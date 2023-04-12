# Cloud

## Development

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Architecture

### Modules

The modules are separated by domain. If we have a controller that handles Posts, all files assosciated with the Posts-domain, will be in the `posts` directory.

#### Module Files

##### **`*.entity.ts`**

Define database entities related to the domain in these files (often used by the service).

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
```

##### **`*.service.ts`**

Define services related to the domain in these files (often used by the domain controller).

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '~/posts/dto/create-post.dto';
import { Post } from '~/posts/post.entity';

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
```

##### **`*.controller.spec.ts`** or **`*.service.spec.ts`**

```ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from '~/posts/dto/create-post.dto';
import { PostsService } from '~/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}
```

##### **`*.controller.spec.ts`**

```ts
import { Test } from '@nestjs/testing';
import { PostsController } from '~/posts/posts.controller';
import { PostsService } from '~/posts/posts.service';

describe('PostController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    postsController = moduleRef.get(PostsController);
    postsService = moduleRef.get(PostsService);
  });

  describe('create', () => {
    it('should return return the created post', async () => {
      const title = 'Post Title Test';

      const result = {
        id: 1,
        title,
      };

      // mock the result of the "create" method on the postsService instance
      jest.spyOn(postsService, 'create').mockImplementation(async () => result);

      expect(
        await postsController.create({
          title,
        }),
      ).toBe(result);
    });
  });
});

export {};
```

##### **`*.module.ts`**

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from '~/posts/posts.service';
import { PostsController } from '~/posts/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
```

##### **`/dto/*.ts`**

Data-validation annotations library: [class-validator](https://github.com/typestack/class-validator)

```ts
import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(10, 30)
  title: string;
}
```
