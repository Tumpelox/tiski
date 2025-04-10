import ProductCard from "@/components/ProductCard";
import { exampleProduct } from "@/interfaces/product.interface";
import { clientSideProduct } from "@/lib/clientSideProduct";

const KooditPage = () => {
  return (
    <div className="w-full">
      <h1>Listaus tuotteista</h1>
      <div className="grid grid-cols-3 gap-4 mx-auto w-fit">
        {[...Array(10)].map((_, index) => (
          <ProductCard
            key={index + "pulla"}
            product={clientSideProduct(exampleProduct)}
          />
        ))}
      </div>
    </div>
  );
};

export default KooditPage;
