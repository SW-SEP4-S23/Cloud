# Cloud

## Development

### Running the project

1. Open the project in VS Code.

> **_NOTE_**: If you don't have a `.env` file yet, copy the `.env.example` file and change the name to `.env`.

2. Install the dependencies: `npm install`.

3. Start the database: `npm run db:start`.

> **_NOTE_**: If this errors, make sure you're not already using PORT 5432. Refer to this guide to close the ports: [Guide](https://stackoverflow.com/a/39633428).

> **_NOTE_**: To stop the database you can run `npm run db:stop`.

4. Sync your database: `npm run db:migrate`

> **_NOTE_**: Bear in mind this also seeds the database with essential records now.

> **_NOTE_**: Like 3. authentication errors in db can also occur of the same reson try this: [Guide]
(https://stackoverflow.com/a/39633428).

5. Run the app: `npm run start:dev`

6. The server should now be running at `localhost:3000`.

> **_NOTE_**: If an error occurs on the API, please try `npm run db:push` - this will seed the DB if possible

### Running tests

```bash
# unit tests
$ npm run test

# e2e tests
# local testing e2e: remember to seed the database before running these tests (npm run db:mock)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Architecture

### Modules

The modules are separated by domain. If we have a controller that handles Posts, all files assosciated with the Posts-domain, will be in the `posts` directory.

#### Module Files

##### **`*.repository.ts`**

Define repositories that executes queries using Prisma in these files.

```ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.posts.findMany({
      select: {
        title: true,
      },
    });
  }
}
```

##### **`*.service.ts`**

Define services related to the domain in these files (often used by the controller).

This example includes the injection of a repository, that is used to handle the given entity.

```ts
import { Injectable } from "@nestjs/common";
import { PostRepository } from "./posts.repository";
import { CreatePostDto } from "~/posts/dto/create-post.dto";
import { Post } from "~/posts/post.entity";

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostRepository) {}

  create(createPostDto: CreatePostDto) {
    return this.postsRepository.save(createPostDto);
  }

  findAll() {
    return this.postsRepository.find();
  }

  findOne(id: number) {
    return this.postsRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.postsRepository.delete(id);
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
import { PostsService } from "~/posts/posts.service";
import { PostsController } from "~/posts/posts.controller";

@Module({
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule.forRoot({ isGlobal: true }),
    PostsModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
```

> **_NOTE_**: PrismaModule should only be included in the `app.module.ts`(root module).

## Migrations

1. Update the `prisma.schema` file to your needs.
2. Syncing the database
3. If you're drafting locally, don't create a migration, run `npm run db:push`.
4. If you're done drafting, create a migration by running `npm run db:migrate`.

> **_NOTE_**: If the types don't update for the Prisma Client, you might need to restart the TS server in VS Code. CTRL + SHIFT + P and run 'Restart TS Server'.
