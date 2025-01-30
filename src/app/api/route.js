import { NextResponse } from "next/server";

export async function GET() {
    const projectInfo = {
        name: "Koji",
        description:
            "Koji is here.",
        founder: "Mirza",
        version: "0.1.0",
        technologies: [
            "Next.js",
            "MongoDB",
            "Tailwind CSS",
            "Node.js",
            "Vercel",
            "Shadcn/UI",
        ],
        deployment: {
            platform: "Vercel",
            region: "Global",
        }
    };

    return NextResponse.json(projectInfo, { status: 200 });
}
