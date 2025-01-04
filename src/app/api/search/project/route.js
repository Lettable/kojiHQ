import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';
import User from '@/lib/model/User.model';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Search query is required.' },
        { status: 400 }
      );
    }

    const projects = await Project.find({
      $or: [
        { title: { $regex: data, $options: 'i' } },
        { description: { $regex: data, $options: 'i' } },
        { tags: { $regex: data, $options: 'i' } }
      ]
    }).lean();

    const projectData = await Promise.all(
      projects.map(async (project) => {
        const author = await User.findById(project.ownerId).lean();
        return {
          id: project._id,
          title: project.title,
          description: project.description,
          priceType: project.priceType,
          price: project.price,
          type: project.category,
          author: author?.username || 'Unknown',
          authorId: author?._id || null,
          profilePic: author?.profilePic || null,
          views: project.views,
          date: project.createdAt,
          verified: author?.verified || false,
          projectStatus: project.projectStatus
        };
      })
    );

    return NextResponse.json(
      { success: true, data: projectData },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
