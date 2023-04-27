//TODO: Import repository
import { createWebSocket } from "./create-websocket";


export async function initSocket(url: string)
{
    const socket = await createWebSocket(url)

    //Måske et andet keyword?
    socket.on("message", (data: any) => {
        data.port === 1 ? 
            onMessage(data) :
            console.log("port is 2 - its the overhead")
      });
}

function onMessage(data: any): void {

    const incomingdata = JSON.parse(data.data.toString());
    
    const hexTranslatedData = translateHex(incomingdata);

    //Repository save

}


//Skal laves om til en adapter
function translateHex(transformedData: string) : number[] {
  // Get the first 6 hex digits (3 bytes) from the input string
  const hexSubstring = transformedData.substring(0, 6);

  // Convert the hex substring to a number
  const hexValue = parseInt(hexSubstring, 16);

  // Create an array to store the result values
  const result = new Array<number>(3);

  // Extract the bytes from the value
  for (let i = 0; i < 3; i++) {
    const byte = (hexValue >> (8 * (2 - i))) & 0xFF;
    result[i] = byte;
  }

  // Return the result array
  return result;
}