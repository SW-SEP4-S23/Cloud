import { Module } from "@nestjs/common";
import { WebSocketService } from "./websocket.service";
import { WebSocketRepository } from "./websocket.repository";

@Module({
  providers: [WebSocketRepository, WebSocketService],
})
export class WebSocketModule {}
