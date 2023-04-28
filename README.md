<<<<<<< HEAD
# Cloud

## Development

### Running the Dev Container

1. Open the project in VS Code.

2. Open the command palette (CTRL + SHIFT + P).

3. Run the command: `Dev Containers: Rebuild and Reopen in Container`.

> **_NOTE_**: If this errors, make sure you're not using PORT 3000 or 5432. Refer to this guide to close the ports: [Guide](https://stackoverflow.com/a/39633428).

4. Run `npm install` in the VS Code Terminal (This will run it in the container).

5. The REST API should now be available at `localhost:3000`.

### Running tests

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
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
```

##### **`*.service.ts`**

Define services related to the domain in these files (often used by the controller).

This example includes the injection of a repository, that is used to handle the given entity.

```ts
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
```

##### **`*.controller.ts`**

The controllers defines the API endpoints. [Read more.](https://docs.nestjs.com/controllers)

```ts
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
```

##### **`*.spec.ts`** (e.g.: `posts.controller.spec.ts`)

The spec-files contain unit-tests for the co-located file. In this example it's unit-testing the controller methods.

> **_NOTE_**: A spec, short for specification, comes from behavior driven testing, and encourages the mindset where you are defining 'what' the software does.

This example includes mocking of a service-class method.

```ts
import { Test } from "@nestjs/testing";
import { PostsController } from "~/posts/posts.controller";
import { PostsService } from "~/posts/posts.service";

describe("PostController", () => {
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

  describe("create", () => {
    it("should return return the created post", async () => {
      const title = "Post Title Test";

      const result = {
        id: 1,
        title,
      };

      // mock the result of the "create" method on the postsService instance
      jest.spyOn(postsService, "create").mockImplementation(async () => result);

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

##### **`/dto/*.ts`**

Data-validation annotations library: [class-validator](https://github.com/typestack/class-validator)

```ts
import { IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @Length(10, 30)
  title: string;
}
```

##### **`*.module.ts`**

Module files encapsulates providers for dependency injection. [Read more.](https://docs.nestjs.com/modules)

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { PostsService } from "~/posts/posts.service";
import { PostsController } from "~/posts/posts.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
```

Remember to import the new module in the `app.module.ts` file, as shown in the example below.

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PostsModule } from "~/posts/posts.module";
import { DataSource } from "typeorm";
import { ormConfig } from "../typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    PostsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
```

## Migrations

1. Update the `prisma.schema` file to your needs.
2. Run `npm run migrate:dev` in the terminal.

> **_NOTE_**: If the types don't update for the Prisma Client, you might need to restart the TS server in VS Code. CTRL + SHIFT + P and run 'Restart TS Server'.
=======
# Cloud
>>>>>>> main
