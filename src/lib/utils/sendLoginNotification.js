import fetch from 'node-fetch';

/**
 * Sends a login notification to Discord webhook with user login details
 * @param {Object} userData - The user data for the logged-in user
 */
export async function sendLoginNotification(userData) {
  const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';

  const message = {
    embeds: [{
      title: 'User Sign-In Details',
      description: 'A user has signed in.',
      color: 3066993,
      fields: [
        { name: 'Username', value: userData.username, inline: true },
        { name: 'Email', value: userData.email, inline: true },
        { name: 'Device Details', value: userData.deviceDetails, inline: false },
        { name: 'IP Address', value: userData.userIP, inline: false },
        { name: 'Profile Picture', value: userData.profilePic, inline: false },
        { name: 'Sign In Date', value: userData.createdAt.toString(), inline: false },
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
