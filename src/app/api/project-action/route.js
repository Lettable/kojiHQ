import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/config/db';
import Project from '@/lib/model/Product.model';

export async function DELETE(req) {
    await connectDB();

    try {
        const projectId = req.nextUrl.searchParams.get('id');

        if (!projectId) {
            return NextResponse.json({ success: false, message: 'Project ID not provided' }, { status: 400 });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        await Project.findByIdAndDelete(projectId);

        return NextResponse.json({ success: true, message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
