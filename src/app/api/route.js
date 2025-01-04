import { NextResponse } from "next/server";

export async function GET() {
    const projectInfo = {
        name: "SideProjector",
        description:
            "SideProjector is a platform designed to showcase, collaborate, and manage side projects efficiently. It helps creators and developers share their work, find collaborators, and learn from each other.",
        founder: "Mirza",
        cofounder: "Rayyan Afridi",
        repository: "https://github.com/mirza/sideprojector",
        website: "https://sideprojector.vercel.app",
        version: "0.1.0",
        technologies: [
            "Next.js",
            "MongoDB",
            "Tailwind CSS",
            "Node.js",
            "Vercel",
            "Shadcn/UI",
        ],
        features: [
            "Project Showcase: Share and view side projects.",
            "Collaboration: Find team members or collaborators.",
            "Leaderboard: Highlight the most active users and top-rated projects.",
        ],
        purpose: "To empower creators and developers to share and collaborate on side projects, providing a supportive and engaging platform for innovation.",
        deployment: {
            platform: "Vercel",
            region: "Global",
        },
        contact: {
            telegram: "t.me/mirzyae",
        },
    };

    return NextResponse.json(projectInfo, { status: 200 });
}
