import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </Nav>
      <div className="container my-7">{children}</div>
    </>
  );
}
