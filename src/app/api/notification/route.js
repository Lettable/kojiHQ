// import { connectDB } from "@/lib/config/db";
// import Notification from "@/lib/model/Notification";
// import User from "@/lib/model/User.model";
// import Project from "@/lib/model/Product.model";
// import { NextResponse } from "next/server";

// const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// export async function POST(req) {
//     await connectDB();

//     try {
//         const { senderId, receiverId, type, state } = await req.json();

//         if (!senderId || !receiverId || !type || !state) {
//             return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//         }

//         const sender = await User.findById(senderId);
//         if (!sender) {
//             return NextResponse.json({ success: false, message: "Sigma not found" }, { status: 404 });
//         }

//         let message = "";

//         switch (type) {
//             case "comment":
//             case "bid": {
//                 if (!projectId) {
//                     return NextResponse.json({ success: false, message: "Product ID is required for this type" }, { status: 400 });
//                 }

//                 const project = await Project.findById(projectId);
//                 if (!project) {
//                     return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
//                 }

//                 const trimmedTitle =
//                     project.title.length > 6
//                         ? project.title.substring(0, 6) + "..."
//                         : project.title;

//                 message = `${sender.username} ${type === "comment" ? "commented on" : "placed a bid on"} your project "${trimmedTitle}"`;
//                 break;
//             }
//             case "follow": {
//                 message = `${sender.username} started following you`;
//                 break;
//             }
//             case "reply": {
//                 if (!projectId) {
//                     return NextResponse.json({ success: false, message: "Project ID is required for this type" }, { status: 400 });
//                 }

//                 const project = await Project.findById(projectId);
//                 if (!project) {
//                     return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
//                 }

//                 const trimmedTitle =
//                     project.title.length > 6
//                         ? project.title.substring(0, 6) + "..."
//                         : project.title;

//                 message = `${sender.username} replied to a comment on your project "${trimmedTitle}"`;
//                 break;
//             }
//             default:
//                 return NextResponse.json({ success: false, message: "Invalid notification type" }, { status: 400 });
//         }
//         let actualReceiver;

//         if (isObjectId(receiverId)) {
//             const newNotification = new Notification({
//                 senderId,
//                 receiverId,
//                 type,
//                 projectId: projectId || null,
//                 message,
//             });
//             await newNotification.save();
//         } else {
//             actualReceiver = await User.findOne({ username: { $regex: `^${receiverId}$`, $options: "i" } });

//             if (!actualReceiver) {
//                 return NextResponse.json({ message: 'User not found' }, { status: 404 });
//             }

//             const newNotification = new Notification({
//                 senderId,
//                 receiverId: actualReceiver._id,
//                 type,
//                 projectId: projectId || null,
//                 message,
//             });
//             await newNotification.save();
//         }

//         return NextResponse.json({ success: true, message: "Notification created successfully" }, { status: 201 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//     }
// }


import { connectDB } from "@/lib/config/db";
import Notification from "@/lib/model/Notification";
import User from "@/lib/model/User.model";
import Product from "@/lib/model/Product.model";
import { NextResponse } from "next/server";

const isObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export async function POST(req) {
  await connectDB();

  try {
    const { senderId, receiverId, type, productId, value } = await req.json();

    if (!senderId || !receiverId || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["productReply", "message", "mention", "rep"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid notification type" },
        { status: 400 }
      );
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return NextResponse.json(
        { success: false, message: "Sender not found" },
        { status: 404 }
      );
    }

    let message = "";
    let state = "";
    let target = "";

    switch (type) {
      case "productReply": {
        if (!productId) {
          return NextResponse.json(
            { success: false, message: "Product ID is required for productReply" },
            { status: 400 }
          );
        }

        const product = await Product.findById(productId);
        if (!product) {
          return NextResponse.json(
            { success: false, message: "Product not found" },
            { status: 404 }
          );
        }

        const trimmedTitle =
          product.title.length > 6
            ? product.title.substring(0, 6) + "..."
            : product.title;

        message = `${sender.username} replied on your product "${trimmedTitle}"`;
        state = "dynamic";
        target = `/product/${productId}`;
        break;
      }
      case "message": {
        message = `${sender.username} sent a new private message`;
        state = "dynamic";
        target = `/chat?user=${senderId}`;
        break;
      }
      case "mention": {
        message = `${sender.username} mentioned you in shoutbox`;
        state = "static";
        target = "";
        break;
      }
      case "rep": {
        if (value === undefined) {
          return NextResponse.json(
            { success: false, message: "Value is required for rep type" },
            { status: 400 }
          );
        }
        message = `${sender.username} rep you by ${value}`;
        state = "static";
        target = "";
        break;
      }
      default:
        return NextResponse.json(
          { success: false, message: "Invalid notification type" },
          { status: 400 }
        );
    }

    let actualReceiverId = receiverId;
    if (!isObjectId(receiverId)) {
      const actualReceiver = await User.findOne({
        username: { $regex: `^${receiverId}$`, $options: "i" },
      });
      if (!actualReceiver) {
        return NextResponse.json(
          { success: false, message: "Receiver not found" },
          { status: 404 }
        );
      }
      actualReceiverId = actualReceiver._id;
    }

    const newNotification = new Notification({
      senderId,
      receiverId: actualReceiverId,
      type,
      productId: productId || null,
      state,
      target,
      message,
    });

    await newNotification.save();

    return NextResponse.json(
      { success: true, message: "Notification created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
