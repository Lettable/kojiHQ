import { NextResponse } from "next/server";
import AdHistory from "@/lib/model/Ads.model.js";

export async function GET(req) {
    try {
        const user_id = req.nextUrl.searchParams.get('id');

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const adsHistory = await AdHistory.find({ user_id: user_id }).sort({ createdAt: -1 });

        if (!adsHistory.length) {
            return NextResponse.json({ error: "No ad history found" }, { status: 404 });
        }

        const formattedAds = adsHistory.map((ad, index) => ({
            id: index + 1,
            groupName: ad.group_name,
            content: ad.message_content,
            link: ad.group_ad_link
        }));

        return NextResponse.json(formattedAds);

    } catch (error) {
        console.error("Error fetching ad history:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
