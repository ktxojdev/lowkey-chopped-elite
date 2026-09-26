import { NextResponse } from "next/server";
import catalogData from "@/data/games-catalog.json";

export interface GameItem {
  id: number;
  title: string;
  cover: string;
  playUrl: string;
  category: string;
  originalUrl?: string;
}

export async function GET() {
  try {
    return NextResponse.json({
      games: catalogData as GameItem[],
      total: catalogData.length,
      source: "LCE-Local",
    });
  } catch (error: any) {
    console.error("Games catalog error:", error);
    return NextResponse.json(
      { error: "Failed to load games catalog", details: error.message },
      { status: 500 }
    );
  }
}
