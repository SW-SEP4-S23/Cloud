import { createWebSocket } from "./create-websocket";
import { DatapointRepository } from "./datapoint.repository";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  DownlinkPayload,
  downlinkPayloadToHex,
  translateHex,
} from "./hex-utils";
import { WebSocket } from "ws";
import { plainToClass } from "class-transformer";
import { UplinkData } from "./dto/uplink-data";
import { validateSync } from "class-validator";
import { IOT_EUI } from "../constants";
import { DownlinkData } from "./dto/downlink-data";

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
  #socket: WebSocket;

  constructor(private datapointRepository: DatapointRepository) {}

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

        await Promise.all([
          this.updateIotThresholds(),
          this.onUplinkData(uplinkData),
        ]);
      }

      console.info("Messsage wasn't handled: ", data);
    });
  }

  async onUplinkData(uplinkData: UplinkData) {
    if (!uplinkData.data) {
      console.error("No data in uplink data");
      return;
    }

    console.info("Uplink data: ", uplinkData.data);

    const [temperature, co2, humidity] = translateHex(uplinkData.data);
    const timestamp = new Date(uplinkData.ts);

    return this.datapointRepository.createDatapoint({
      timestamp,
      temperature,
      co2,
      humidity,
    });
  }

  async updateIotThresholds() {
    // placeholder input
    const newThresholds: DownlinkPayload = {
      id: "01",
      temperature: {
        minValue: 10,
        maxValue: 20,
      },
      co2: {
        minValue: 10,
        maxValue: 20,
      },
      humidity: {
        minValue: 10,
        maxValue: 20,
      },
    };

    const payload = downlinkPayloadToHex(newThresholds);

    const data: DownlinkData = {
      cmd: "tx",
      EUI: IOT_EUI,
      port: 2,
      confirmed: false,
      data: payload,
    };

    this.#socket.send(JSON.stringify(data));

    console.log("sent");
  }
}
