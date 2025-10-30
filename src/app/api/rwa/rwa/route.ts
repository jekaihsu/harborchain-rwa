// src/app/api/rwa/route.ts
import { NextResponse } from "next/server";
import { products } from "@/components/data/rwaProducts";

export async function GET() {
  return NextResponse.json(products);
}
