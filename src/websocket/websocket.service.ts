import { createWebSocket } from "./create-websocket";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  downlinkDataToHexPayload,
  hexToNumberArray,
  uplinkHexPayloadToData,
} from "./hex-utils";
import { WebSocket } from "ws";
import { plainToClass } from "class-transformer";
import { UplinkData } from "./dto/uplink-data";
import { validateSync } from "class-validator";
import { IOT_EUI } from "../constants";
import { DownlinkData } from "./dto/downlink-data";
import { WebSocketRepository } from "./websocket.repository";

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
  #socket: WebSocket;

  constructor(private wsRepository: WebSocketRepository) {}

  async onModuleDestroy() {
    await this.#socket.close();
  }

  async onModuleInit() {
    this.#socket = await createWebSocket(
      "wss://iotnet.teracom.dk/app?token=vnoVQAAAABFpb3RuZXQudGVyYWNvbS5ka0AHfDGv873AtxYtbA-B0Sw=",
    );
    await this.initSocket();
  }

  async initSocket(): Promise<void> {
    this.#socket.on("message", async (buffer: Buffer) => {
      const data = JSON.parse(buffer.toString());

      console.log("Data: ", data);

      // Only handle the data packet of the uplink.
      if (data?.cmd === "rx" && data?.port == 1) {
        // Validate incoming data.
        const uplinkData = plainToClass(UplinkData, data);
        const validationErrors = validateSync(uplinkData);
        if (validationErrors.length > 0) {
          console.error("Validation of uplink data failed: ", validationErrors);
          return;
        }

        this.onUplink(uplinkData);
      }
    });
  }

  async onUplink(uplinkData: UplinkData) {
    if (!uplinkData.data) {
      console.error("No data in uplink data");
      return;
    }

    const { id, temperature, co2, humidity } = uplinkHexPayloadToData(
      uplinkData.data,
    );
    const timestamp = new Date(uplinkData.ts);

    return Promise.all([
      this.checkDownlinkAck(id),
      this.sendDownlink(),
      this.wsRepository.createDatapoint({
        timestamp,
        temperature,
        co2,
        humidity,
      }),
    ]);
  }

  async sendDownlink() {
    // get threshold update requests
    //
    // if there is any requests, process them
    //
    // transform the ack-id using modulo 256, so it will fit in two bytes
    //
    // create payload
    // const payload = downlinkDataToHexPayload({
    //   id: this.#lastAckId,
    //   thresholds,
    // });
    //
    // create full downlink data object
    // const data: DownlinkData = {
    //   cmd: "tx",
    //   EUI: IOT_EUI,
    //   port: 1,
    //   confirmed: false,
    //   data: payload,
    // };
    //
    // send the downlink
    // this.#socket.send(JSON.stringify(data));
  }

  async checkDownlinkAck(ackId: number) {
    // get the size of the ack table
    //
    // get the real ackId by reversing the modulo 256 operation
    //
    // set ack to true for the ackId
  }
}
