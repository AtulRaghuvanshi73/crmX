// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.post("/dummyVendorAPI/batch", (req, res) => {
//   const messages = req.body.messages;
//   console.log("Received batch messages:", messages);
//   res.status(200).send("Batch processed successfully");
// });

// app.listen(3002, () => {
//   console.log("Dummy Vendor API is running on port 3002");
// });
// import express from "express";
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import CommunicationLog from "./model/campaign-shema";
// import { Connection } from "./database/db";
// import cors from "cors";

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// Connection();

// app.post("/deliveryReceipt", async (req, res) => {
//   const { logId, status } = req.body;

//   try {
//     await CommunicationLog.findByIdAndUpdate(logId, { status });
//     res.status(200).send("Status updated");
//   } catch (error) {
//     res.status(500).send("Error updating status");
//   }
// });

// app.listen(3003, () => {
//   console.log("Delivery Receipt API is running on port 3003");
// });
import express from "express";
import amqp from "amqplib";
import mongoose from "mongoose";
import CommunicationLog from "./model/campaign-shema"; // Update path if necessary
import { Connection } from "./database/db"; // Update path if necessary

// Interface for Customer messages
interface Customer {
  custName: string;
  custEmail: string;
  status: string;
}

// RabbitMQ and Batch Processing Configurations
const RABBITMQ_URL =
  process.env.RABBITMQ_URL ||
  "amqps://jhizuqgc:UV6QGCAZ5d6weQVZulabvWfpYbC1ubet@puffin.rmq2.cloudamqp.com/jhizuqgc";
const EXCHANGE = "venderExchange";

Connection(); // Connect to MongoDB

// Function to initialize RabbitMQ Consumer
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert the exchange
    await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    // Create a unique, exclusive queue for this consumer
    const queue = await channel.assertQueue("", { exclusive: true });

    // Bind the queue to the exchange
    await channel.bindQueue(queue.queue, EXCHANGE, "");

    console.log(
      `Consumer bound to exchange. Listening on queue: ${queue.queue}`
    );

    // Start consuming messages
    channel.consume(queue.queue, async (msg) => {
      if (msg) {
        try {
          // Parse the message content
          const customer: Customer = JSON.parse(msg.content.toString());

          if (customer.status == "SENT") {
            console.log(`Email sent to ${customer.custName}`);
          }

          // Acknowledge the message
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);

          // Acknowledge the message even on failure to prevent re-delivery
          channel.ack(msg);
        }
      }
    });

    console.log("RabbitMQ consumer connected and awaiting messages.");
  } catch (err) {
    console.error("Failed to connect to RabbitMQ:", err);
  }
}

// Start RabbitMQ Consumer
connectRabbitMQ();
