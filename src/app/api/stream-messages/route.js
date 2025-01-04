// import { connectDB } from "@/lib/config/db";
// import Message from "@/lib/model/Message";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   if (mongoose.connection.readyState === 0) {
//     await connectDB();
//   }

//   const stream = new ReadableStream({
//     start(controller) {
//       let changeStream;

//       const initChangeStream = () => {
//         try {
//           changeStream = Message.watch();

//           changeStream.on("change", (change) => {
//             if (change.operationType === "insert") {
//               const newMessage = change.fullDocument;
//               const messageString = `data: ${JSON.stringify(newMessage)}\n\n`;
//               controller.enqueue(new TextEncoder().encode(messageString));
//             }
//           });

//           changeStream.on("error", (error) => {
//             console.error("Change stream error:", error);
//             reconnectChangeStream();
//           });

//           changeStream.on("close", () => {
//             console.warn("Change stream closed. Attempting to reconnect...");
//             reconnectChangeStream();
//           });
//         } catch (error) {
//           console.error("Failed to initialize change stream:", error);
//         }
//       };

//       const reconnectChangeStream = () => {
//         if (changeStream) changeStream.close();
//         initChangeStream();
//       };

//       initChangeStream();

//       const heartbeatInterval = setInterval(() => {
//         const heartbeatMessage = "data: ping\n\n";
//         controller.enqueue(new TextEncoder().encode(heartbeatMessage));
//       }, 2500);

//       req.signal.addEventListener("abort", () => {
//         clearInterval(heartbeatInterval);
//         if (changeStream) changeStream.close();
//         controller.close();
//       });
//     },
//   });

//   return new NextResponse(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }


// pages/api/stream-messages.js
import connectRedis from "@/lib/config/redis";
import { NextResponse } from "next/server";

export async function GET(req) {
  const redis = connectRedis();
  const stream = new ReadableStream({
    start(controller) {
      const subscriber = redis.duplicate();
      subscriber.subscribe('chat:channel');

      subscriber.on('message', (channel, message) => {
        
        controller.enqueue(new TextEncoder().encode(`data: ${message}\n\n`));
      });

      req.signal.addEventListener("abort", () => {
        subscriber.quit();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}