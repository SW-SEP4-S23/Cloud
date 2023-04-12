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
