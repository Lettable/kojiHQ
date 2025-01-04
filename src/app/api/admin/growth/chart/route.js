import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import Project from '@/lib/model/Product.model';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    const users = await User.find({}, { createdAt: 1 });
    const projects = await Project.find({}, { createdAt: 1 });

    const formatDate = (date) => new Date(date).toISOString().split('T')[0];

    const growthDataMap = {};

    users.forEach((user) => {
      const date = formatDate(user.createdAt);
      if (!growthDataMap[date]) growthDataMap[date] = { users: 0, projects: 0 };
      growthDataMap[date].users += 1;
    });

    projects.forEach((project) => {
      const date = formatDate(project.createdAt);
      if (!growthDataMap[date]) growthDataMap[date] = { users: 0, projects: 0 };
      growthDataMap[date].projects += 1;
    });

    const growthData = Object.entries(growthDataMap).map(([date, data]) => ({
      date,
      ...data,
    }));
    growthData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return NextResponse.json(growthData);
  } catch (error) {
    console.error('Error generating growth data:', error);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
