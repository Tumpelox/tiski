import { BundleDocument } from '@/interfaces/bundle.interface';
import { ProductDocument } from '@/interfaces/product.interface';

export const clientSideProduct = (productDocument: ProductDocument) => ({
  $id: productDocument.$id,
  title: productDocument.title,
  description: productDocument.description,
  stock: productDocument.stock,
  available: productDocument.available,
  pictures: productDocument.pictures,
});

export const clientSideBundle = (productDocument: BundleDocument) => ({
  $id: productDocument.$id,
  title: productDocument.title,
  description: productDocument.description,
  products: productDocument.products.map((product) =>
    clientSideProduct(product)
  ),
  available: productDocument.available,
});
