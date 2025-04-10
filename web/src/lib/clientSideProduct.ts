import { ProductDocument } from "@/interfaces/product.interface";

export const clientSideProduct = (productDocument: ProductDocument) => ({
  $id: productDocument.$id,
  title: productDocument.title,
  description: productDocument.description,
  stock: productDocument.stock,
  available: productDocument.available,
  pictures: productDocument.pictures,
});
