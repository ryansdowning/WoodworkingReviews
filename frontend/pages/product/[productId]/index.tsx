import { ProductPageStack } from "../../../components/Products/ProductPageStack";
import { WWReviewsAppShell } from "../../../components/WWReviewsAppShell/WWReviewsAppShell";
import { useResource, useResources } from "../../../utilities/hooks";
import { BasicProductReview, Category, Feedback, Product, Rating } from "../../../utilities/types/products";
import { useRouter } from "next/router";

export default function ProductPage() {
  const router = useRouter();
  const { productId } = router.query;
  const [product] = useResource<Product>("products/product/", parseInt(productId as string), {
    isAuthorized: false,
  });
  const [basicReview] = useResource<BasicProductReview>(
    "products/basic-product-review/",
    parseInt(productId as string),
    {
      isAuthorized: false,
    }
  );
  const [category] = useResource<Category>("products/category/", product?.category, {
    isAuthorized: false,
    dependsOn: [product],
  });
  const [ratings] = useResources<Rating>("products/rating/", {
    filters: { product: productId },
    dependsOn: [productId],
    isAuthorized: false,
  });
  const [feedbacks] = useResources<Feedback>("products/feedback/", {
    filters: { product: productId },
    dependsOn: [productId],
    isAuthorized: false,
  });

  return (
    <WWReviewsAppShell>
      {category && (
        <ProductPageStack
          product={product}
          categoryName={category.name}
          basicReview={basicReview}
          ratings={ratings}
          feedbacks={feedbacks}
        />
      )}
    </WWReviewsAppShell>
  );
}
