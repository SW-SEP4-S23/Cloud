import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ExampleModule } from "./example/example.module";
import { WebSocketModule } from "./websocket/websocket.module";

@Module({
  imports: [ConfigModule.forRoot(), ExampleModule, WebSocketModule],
})
export class AppModule {}
