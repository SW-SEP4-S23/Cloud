import { createWebSocket } from "./create-websocket";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { downlinkDataToHexPayload, uplinkHexPayloadToData } from "./hex-utils";
import { WebSocket } from "ws";
import { plainToClass } from "class-transformer";
import { UplinkData } from "./dto/uplink-data";
import { validateSync } from "class-validator";
import { IOT_EUI, MAX_ACK_ID } from "../constants";
import { DownlinkData, DownlinkThresholds } from "./dto/downlink-data";
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

    await this.confirmDownlinkAck(id, timestamp);

    return Promise.all([
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
    const updateRequestArray =
      await this.wsRepository.getLatestThresholdUpdateRequests();

    if (updateRequestArray.length === 0) {
      console.info("No unacked requests");
      return;
    }

    const ack = await this.wsRepository.createAcksForThresholdUpdateRequests(
      updateRequestArray,
    );

    // transform the ack-id using modulo 256, so it will fit in two bytes
    const ackId = ack.id % MAX_ACK_ID;

    const thresholds = updateRequestArray.reduce((acc, curr) => {
      acc[curr.dataType] = {
        minValue: curr.minValueReq,
        maxValue: curr.maxValueReq,
      };
      return acc;
    }, {} as DownlinkThresholds);

    const payload = downlinkDataToHexPayload({
      ackId,
      thresholds,
    });

    const downlinkData: DownlinkData = {
      cmd: "tx",
      EUI: IOT_EUI,
      port: 1,
      confirmed: false,
      data: payload,
    };

    this.#socket.send(JSON.stringify(downlinkData));
  }

  async confirmDownlinkAck(ackId: number, uplinkTimestamp: Date) {
    const ackTableSize = await this.wsRepository.getAcksCount();

    // get the real ackId by reversing the modulo 256 operation
    // e.g.: i recieve the ackId 2, but the ackId is actually 770 (2 + 256 * 3)
    const realAckId = ackId + MAX_ACK_ID * (ackTableSize % MAX_ACK_ID);

    await this.wsRepository.confirmAck(realAckId, uplinkTimestamp);
  }
}
