import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({});

    const projectDetails = await Promise.all(projects.map(async (project) => {
      const owner = await User.findById(project.ownerId);
      return {
        _id: project._id.toString(),
        title: project.title,
        description: project.description,
        tags: project.tags,
        price: project.price || project.startingBid,
        status: project.status,
        views: project.views,
        createdAt: project.createdAt.toISOString(),
        owner: owner ? owner.username : 'Unknown'
      };
    }));

    return NextResponse.json(projectDetails);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
