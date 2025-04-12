"use server";

import { OrderDatabase } from "@/interfaces/order.interface";
import { Product } from "@/interfaces/product.interface";
import { getAdminDatabases } from "@/services/databases";
import { getOrderCode } from "@/services/orderCode";
import { getLoggedInUser } from "@/services/userSession";
import { redirect } from "next/navigation";
import { ID, Permission, Role } from "node-appwrite";

export interface Order {
  items: Product[];
  shippingName: string;
  shippingAddress: string;
}

export const newOrder = async (order: Order) => {
  const { items } = order;

  const user = await getLoggedInUser();

  if (!user) {
    console.error("User not found. Cannot create order.");
    return "hölöpölö";
  }

  const orderCode = await getOrderCode(user.$id);

  if (!orderCode) {
    console.error("Order code not found for user:", user.$id);
    return "hölöpölö";
  }

  const databases = await getAdminDatabases();

  const adminLabel = process.env.APPWRITE_ADMIN_LABEL_ID;

  if (!adminLabel) {
    console.error("Admin team ID is not set in environment variables.");
    return "hölöpölö";
  }

  const newOrder = await databases.createDocument(
    OrderDatabase.DatabaseId,
    OrderDatabase.CollectionId,
    ID.unique(),
    {
      orderCode: orderCode.$id,
      products: items.map((item) => item.$id),
      bundles: [],
      shippingName: order.shippingName,
      shippingAddress: order.shippingAddress,
    },
    [
      Permission.read(Role.user(user.$id)),
      Permission.read(Role.label(adminLabel)),
      Permission.update(Role.label(adminLabel)),
      Permission.delete(Role.label(adminLabel)),
    ]
  );

  redirect(`/tilaus/${newOrder.$id}`);
};
