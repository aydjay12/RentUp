import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		residencies: [
			{
				residency: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Residency",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
