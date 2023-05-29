import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  downlinkDataToHexPayload,
  originalIdFromPayloadId,
  payloadIdFromOriginalId,
  uplinkHexPayloadToData,
} from "./payload-utils";
import { WebSocket } from "ws";
import { plainToClass } from "class-transformer";
import { UplinkData } from "./dto/uplink-data";
import { validateSync } from "class-validator";
import { IOT_EUI, LORAWAN_WSS_URL } from "./constants";
import { DownlinkData, Thresholds } from "./dto/downlink-data";
import { WebSocketRepository } from "./websocket.repository";

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
  #socket: WebSocket;
  #reconnectInterval: number;

  constructor(private wsRepository: WebSocketRepository) {
    this.#reconnectInterval = 1000 * 60; // 1 minute
  }

  async onModuleDestroy() {
    await this.closeWebSocket();
  }

  async onModuleInit() {
    await this.connectWebSocket();
  }

  async connectWebSocket() {
    await new Promise<void>((resolve, reject) => {
      this.#socket = new WebSocket(LORAWAN_WSS_URL);

      this.#socket.on("open", () => {
        console.info("Socket opened");
        resolve();
      });

      this.#socket.on("error", (err) => {
        console.error("Error in websocket: ", err);
        reject(err);
      });

      this.#socket.on("close", () => {
        console.info("Socket closed");

        console.info("Reconnecting in ", this.#reconnectInterval);
        setTimeout(() => {
          console.info("Reconnecting...");
          this.connectWebSocket();
        }, this.#reconnectInterval);
      });

      this.#socket.on("message", async (buffer: Buffer) => {
        const data = JSON.parse(buffer.toString());

        console.log("Data: ", data);

        // Only handle the data packet of the uplink.
        if (data?.cmd === "rx" && data?.port == 1) {
          // Validate incoming data.
          const uplinkData = plainToClass(UplinkData, data);
          const validationErrors = validateSync(uplinkData);
          if (validationErrors.length > 0) {
            console.error(
              "Validation of uplink data failed: ",
              validationErrors,
            );
            return;
          }

          this.onUplink(uplinkData);
        }
      });
    });
  }

  closeWebSocket() {
    return new Promise<void>((resolve) => {
      console.info("Closing socket...");

      this.#socket.removeAllListeners("close");

      this.#socket.on("close", () => {
        resolve();
      });

      this.#socket.close();
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

    if (id) {
      console.log("Ack id from payload: ", id);
      await this.confirmDownlinkAck(id, timestamp);
    } else {
      console.info("No ack id");
    }

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
    const latestThresholdRequests =
      await this.wsRepository.getLatestThresholdUpdateRequests();

    if (latestThresholdRequests.length === 0) {
      console.info("No unacked requests");
      return;
    }

    const currentThresholds = await this.wsRepository.getCurrentThresholds();

    // if there is no threshold request for a specific data type, use the current threshold
    const updateRequestArray = Object.values(currentThresholds).map(
      (currentThreshold, index) => {
        const latestThresholdRequest = latestThresholdRequests[index];

        if (!latestThresholdRequest) {
          return {
            id: null,
            dataType: currentThreshold.dataType,
            minValueReq: currentThreshold.minValue,
            maxValueReq: currentThreshold.maxValue,
          };
        }

        return latestThresholdRequest;
      },
    );

    const ack = await this.wsRepository.createAcksForThresholdUpdateRequests(
      updateRequestArray.filter((updateRequest) => updateRequest.id === null),
    );

    const ackId = payloadIdFromOriginalId(ack.id);

    console.log("SEND ACK ID: ", ackId);

    const thresholds = updateRequestArray.reduce((acc, curr) => {
      acc[curr.dataType] = {
        minValue: curr.minValueReq,
        maxValue: curr.maxValueReq,
      };
      return acc;
    }, {} as Thresholds);

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
    const originalId = originalIdFromPayloadId(ackId, ackTableSize);

    try {
      console.log("RECEIVED ACK ID: ", originalId);
      await this.wsRepository.confirmAck(originalId, uplinkTimestamp);
    } catch (e) {
      console.error(`Error confirming ack with id: ${originalId}.`, e);
      return;
    }

    const newThresholds =
      await this.wsRepository.getNewThresholdsFromRequests();
    await this.wsRepository.updateThresholds(newThresholds);
  }
}
