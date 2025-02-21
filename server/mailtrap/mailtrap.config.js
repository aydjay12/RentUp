import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = "c4b5fa7cf9f6ac3af8da0fb2d1008d42";

export const mailtrapClient = new MailtrapClient({
	token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "RentUp",
};
