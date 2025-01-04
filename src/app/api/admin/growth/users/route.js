import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import Project from '@/lib/model/Product.model';
import LoginActivity from '@/lib/model/LoginActivity';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const startOfHour = new Date(now.setMinutes(0, 0, 0));
        const oneHourAgo = new Date(startOfHour);
        oneHourAgo.setHours(startOfHour.getHours() - 1);

        const startOfThisMonth = new Date(startOfToday);
        startOfThisMonth.setDate(1);
        const startOfLastMonth = new Date(startOfThisMonth);
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

        const totalUsers = await User.countDocuments();
        const totalUsersLastMonth = await User.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        });

        const totalProjects = await Project.countDocuments();
        const totalProjectsLastMonth = await Project.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        });

        const activeUsersToday = await LoginActivity.distinct('userId', {
            createdAt: { $gte: startOfToday },
        }).then((userIds) => userIds.length);

        const activeUsersLastHour = await LoginActivity.distinct('userId', {
            createdAt: { $gte: oneHourAgo, $lt: startOfHour },
        }).then((userIds) => userIds.length);

        const newProjectsToday = await Project.countDocuments({
            createdAt: { $gte: startOfToday },
        });
        const newProjectsYesterday = await Project.countDocuments({
            createdAt: { $gte: startOfYesterday, $lt: startOfToday },
        });

        const userGrowthPercentage =
            totalUsersLastMonth === 0
                ? 100
                : ((totalUsers - totalUsersLastMonth) / totalUsersLastMonth) * 100;

        const projectGrowthPercentage =
            totalProjectsLastMonth === 0
                ? 100
                : ((totalProjects - totalProjectsLastMonth) / totalProjectsLastMonth) *
                100;

        const activeUserDiff = activeUsersToday - activeUsersLastHour;

        const newProjectsGrowthPercentage =
            newProjectsYesterday === 0
                ? (newProjectsToday === 0 ? 0 : 100)
                : ((newProjectsToday - newProjectsYesterday) / newProjectsYesterday) * 100;


        return NextResponse.json({
            totalUsers: {
                value: totalUsers,
                growth: `${userGrowthPercentage.toFixed(1)}% from last month`,
            },
            totalProjects: {
                value: totalProjects,
                growth: `${projectGrowthPercentage.toFixed(1)}% from last month`,
            },
            activeUsers: {
                value: activeUsersToday,
                diff: `${activeUserDiff > 0 ? '+' : ''}${activeUserDiff} since last hour`,
            },
            newProjectsToday: {
                value: newProjectsToday,
                growth: `${newProjectsGrowthPercentage.toFixed(1)}% from yesterday`,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats.' },
            { status: 500 }
        );
    }
}
