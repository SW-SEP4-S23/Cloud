import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { DatapointRepository } from "./datapoint.repository";
import { WebSocketService } from "./websocket.service";

@Module({
  providers: [PrismaService, DatapointRepository, WebSocketService],
})
export class WebSocketModule {}
