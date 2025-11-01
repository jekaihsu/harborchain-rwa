// src/app/api/rwa/route.ts
import { NextResponse } from "next/server";
import { products } from "@/features/rwa-orbit/data/products";

export async function GET() {
  return NextResponse.json(products);
}
