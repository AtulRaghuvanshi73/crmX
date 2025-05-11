import express from "express";
import {
  addShop,
  getAllOrderData,
  getCampaignData,
  getCustData,
  getShopData,
  deleteShop,
} from "../controller/shop-controller";
import amqp from "amqplib";
import Order from "../model/order-schema";
import Customer from "../model/customer-schema";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

let channel: any, connection;

router.post("/addshop", addShop);
router.post("/getshopdata", getShopData);
router.delete("/deleteshop/:id", deleteShop);
// router.post("/getcustdata", getCustData);
router.post("/getAllOrderData", getAllOrderData);
router.post("/getAllCustomerData", getCustData);
router.get("/getAllCampaignData", getCampaignData);

async function connectRabbitMQ() {
  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL || "";
    if (!RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL is not defined in environment variables");
    }
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("campaignQueue");

    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
}

connectRabbitMQ();

const QUEUE = "campaignQueue";

router.post("/customer", async (req, res) => {
  const { custName, custEmail, spends, visits, lastVisits, shopName } =
    req.body;

  const customer = new Customer({
    custName,
    custEmail,
    spends,
    visits,
    lastVisits,
    shopName,
  });

  try {
    await customer.save();
    res.status(201).send("Customer submitted and saved to DB");
  } catch (error) {
    res.status(500).send("Error submitting customer");
  }
});

router.post("/sendCampaign", async (req, res) => {
  const { customers } = req.body;

  if (!customers || !Array.isArray(customers)) {
    return res.status(400).send("Invalid input");
  }

  try {
    // Assert a fanout exchange for Pub/Sub
    const EXCHANGE = "campaignExchange";
    await channel.assertExchange(EXCHANGE, "fanout", { durable: false });

    // Publish each customer message to the exchange
    for (const customer of customers) {
      const message = JSON.stringify(customer);
      await channel.publish(EXCHANGE, "", Buffer.from(message));
      console.log(`Message published: ${message}`);
    }

    res.status(200).send("Campaign messages sent to exchange");
  } catch (error) {
    console.error("Error publishing to exchange:", error);
    res.status(500).send("Failed to send campaign messages");
  }
});

router.post("/order", async (req, res) => {
  const { orderName, orderEmail, amount, orderDate, shopName } = req.body;

  const order = new Order({
    orderName,
    orderEmail,
    amount,
    orderDate,
    shopName,
  });

  try {
    await order.save();
    res.status(201).send("Order submitted and saved to DB");
  } catch (error) {
    res.status(500).send("Error submitting order");
  }
});

export default router;
