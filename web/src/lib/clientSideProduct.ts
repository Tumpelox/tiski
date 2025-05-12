import { BundleDocument } from '@/interfaces/bundle.interface';
import { ProductDocument } from '@/interfaces/product.interface';

export const clientSideProduct = (productDocument: ProductDocument) => ({
  $id: productDocument.$id,
  title: productDocument.title,
  description: productDocument.description,
  stock: productDocument.stock,
  available: productDocument.available,
  pictures: productDocument.pictures,
  hidden: productDocument.hidden,
});

export const clientSideBundle = (bundleDocument: BundleDocument) => ({
  $id: bundleDocument.$id,
  title: bundleDocument.title,
  description: bundleDocument.description,
  products: bundleDocument.products.map((product) =>
    clientSideProduct(product)
  ),
  available: bundleDocument.available,
  hidden: bundleDocument.hidden,
  promoImage: bundleDocument.promoImage,
});
