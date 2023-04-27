import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { DatapointRepository } from "./datapoint.repository";
import { WebsocketService } from "./websocket.service";

@Module({
  providers: [PrismaService, DatapointRepository, WebsocketService],
})
export class WebSocketModule {}
