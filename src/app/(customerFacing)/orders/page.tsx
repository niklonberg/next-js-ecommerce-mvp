"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState, useFormStatus } from "react-dom";

export default function MyOrdersPage() {
  return (
    <form className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="mb-2">My Orders</CardTitle>
          <CardDescription>
            Submit your email address below. <br />
            We will send your order history and download links to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" required name="email" id="email"></Input>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full py-6" size="lg" disabled={pending} type="submit">
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}
