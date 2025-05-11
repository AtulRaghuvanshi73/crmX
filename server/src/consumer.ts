import express from "express";
import amqp from "amqplib";
import mongoose from "mongoose";
import CommunicationLog from "./model/campaign-shema"; // Update path if necessary
import { Connection } from "./database/db"; // Update path if necessary

// Interface for Customer messages
interface Customer {
  custName: string;
  custEmail: string;
}

// RabbitMQ and Batch Processing Configurations
const RABBITMQ_URL =
  process.env.RABBITMQ_URL ||
  "amqps://jhizuqgc:UV6QGCAZ5d6weQVZulabvWfpYbC1ubet@puffin.rmq2.cloudamqp.com/jhizuqgc";
const BATCH_SIZE = 10;

Connection(); // Connect to MongoDB

// Function to initialize RabbitMQ Consumer
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const EXCHANGE = "campaignExchange";

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
          const customer: Customer = JSON.parse(msg.content.toString());

          // console.log(`Received message: ${msg.content.toString()}`);

          // Save to MongoDB
          const log = new CommunicationLog({
            custName: customer.custName,
            custEmail: customer.custEmail,
            status: "PENDING",
          });
          await log.save();

          // Acknowledge the message
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          // Do not requeue in Pub/Sub, just log the error
          channel.ack(msg); // Acknowledge even on failure to avoid infinite loops
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
