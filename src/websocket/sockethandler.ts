//TODO: Import repository
import { createWebSocket } from "./create-websocket";

async function InitSocket()
{
    const socket = await createWebSocket("sdf")

    //Måske et andet keyword
    socket.on("message", (data) => {
        onMessage(data);
      });
}

export function onMessage(data: any): void {

    const incomingdata = JSON.parse(data.toString());
    
    const hexTranslatedData = translateHex(incomingdata);


}


//Skal laves om til en adapter
function translateHex(transformedData: string) {
    
}