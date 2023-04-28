import { Test } from "@nestjs/testing";
import { WebSocketService } from "./websocket.service";
import { DatapointRepository } from "./datapoint.repository";
import { PrismaService } from "../prisma.service";

describe("WebSocketService", () => {
  let webSocketService: WebSocketService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WebSocketService, DatapointRepository, PrismaService],
    }).compile();

    webSocketService = moduleRef.get(WebSocketService);
  });

  describe("onMessage", () => {
    it("should create a datapoint", async () => {
      const result = await webSocketService.onMessage(
        JSON.stringify({
          data: "112233",
        }),
      );

      expect(result).toEqual({
        timestamp: expect.any(Date),
        co2: expect.any(Number),
        humidity: expect.any(Number),
        temperature: expect.any(Number),
      });
    });
  });
});
