import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./_components/OrderInformation";

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
  };
};

export default function PurchaseReceiptEmail({
  product,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation></OrderInformation>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
