import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/config/db';
import User from '@/lib/model/User.model';
import dayjs from 'dayjs';

const JWT_SECRET = process.env.JWT_SECRET;

const PLANS = [
  {
    name: 'Weekly',
    price: 4.99,
    period: 'week',
    groups: ['heaven'],
    features: [
      'Custom Status',
      'Access to Premium Emojis',
      'Premium API access (fast and reliable)',
      'Longer Bio',
      'Priority Support',
      'Increased Visibility'
    ]
  },
  {
    name: 'Monthly',
    price: 16.99,
    period: 'month',
    groups: ['godlike'],
    features: [
      'All Weekly features',
      'Access to Premium Emojis',
      'Premium API access (fast and reliable)',
      'Longer Bio and Username',
      'Priority Support',
      'Maximum Visibility Boost'
    ]
  },
  {
    name: 'Yearly',
    price: 299.99,
    period: 'year',
    groups: ['supreme'],
    features: [
      'All Monthly Features',
      'Custom Badge with Tagline',
      'Early Access to New Features',
      'Personal Account Manager',
      'Unlimited Project Showcases',
      'VIP Community Access'
    ]
  }
];

export async function POST(request) {
  try {
    await connectDB();

    const { token, planName } = await request.json();

    if (!token || !planName) {
      return NextResponse.json(
        { message: 'Token and planName are required' },
        { status: 400 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const selectedPlan = PLANS.find(plan => plan.name === planName);

    if (!selectedPlan) {
      return NextResponse.json(
        { message: 'Invalid plan name provided' },
        { status: 400 }
      );
    }

    if (user.credits < selectedPlan.price) {
      return NextResponse.json(
        { message: 'Not enough credits to purchase this plan' },
        { status: 403 }
      );
    }

    const premiumEndDate = dayjs().add(1, selectedPlan.period).toDate();

    user.credits -= selectedPlan.price;
    user.isPremium = true;
    user.planName = selectedPlan.name;
    user.premiumEndDate = premiumEndDate;

    user.groups = user.groups || [];

    const newGroups = selectedPlan.groups.map(groupName => ({
      groupName,
      assignedAt: new Date()
    }));

    const groupSet = new Map(
      [...user.groups.map(group => [group.groupName, group])].concat(
        newGroups.map(group => [group.groupName, group])
      )
    );

    user.groups = Array.from(groupSet.values());

    await user.save();

    const daysRemaining = dayjs(premiumEndDate).diff(dayjs(), 'day');

    return NextResponse.json(
      {
        message: 'Premium plan purchased successfully',
        remainingCredits: user.credits,
        planName: selectedPlan.name,
        premiumEndDate,
        daysRemaining,
        assignedGroups: selectedPlan.groups
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error purchasing premium plan:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
