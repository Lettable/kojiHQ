import axios from 'axios';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1311216504091574302/AoyTGgrGvsLBfMEr-LN7Xn85h0DtW7ZM6xqwxFN391uR8KMbZCWykiSUSRqC0rs50Snf';

/**
 * Sends a Discord notification with detailed project information
 * @param {string} ownerId - The ID of the user who submitted the project
 * @param {Object} project - The saved project object
 */

const sendDiscordNotification = async (ownerId, project) => {
    const {
        title,
        priceType,
        price,
        startingBid,
        incrementBid,
        bidEndDate,
        category,
        projectUrl,
        description,
        interestedInSelling,
        lookingForCoFounder,
        futurePotential,
        tags,
    } = project;

    const embed = {
        username: 'Side Projector',
        embeds: [
            {
                title: `🚀 New Project Submitted: **${title}**`,
                description: description || 'No description provided.',
                color: 5814783,
                fields: [
                    {
                        name: 'Category',
                        value: category || 'Not specified',
                        inline: true,
                    },
                    {
                        name: 'Price Type',
                        value: priceType === 'fixed' ? 'Fixed Price' : priceType === 'bid' ? 'Bidding' : 'Showcasing',
                        inline: true,
                    },
                    ...(priceType === 'fixed' && price
                        ? [
                            {
                                name: 'Price',
                                value: `$${price}`,
                                inline: true,
                            },
                        ]
                        : []),
                    ...(priceType === 'bid'
                        ? [
                            {
                                name: 'Starting Bid',
                                value: `$${startingBid}`,
                                inline: true,
                            },
                            {
                                name: 'Increment Bid',
                                value: `$${incrementBid}`,
                                inline: true,
                            },
                            {
                                name: 'Bid End Date',
                                value: new Date(bidEndDate).toLocaleString(),
                                inline: true,
                            },
                        ]
                        : []),
                    {
                        name: 'Interested in Selling?',
                        value: interestedInSelling ? '✅ Yes' : '❌ No',
                        inline: true,
                    },
                    {
                        name: 'Looking for Co-Founder?',
                        value: lookingForCoFounder ? '✅ Yes' : '❌ No',
                        inline: true,
                    },
                    {
                        name: 'Future Potential',
                        value: futurePotential || 'Not specified',
                        inline: false,
                    },
                    {
                        name: 'Tags',
                        value: tags.length > 0 ? tags.join(', ') : 'No tags provided',
                        inline: false,
                    },
                    {
                        name: 'Project URL',
                        value: projectUrl || 'Not provided',
                        inline: false,
                    },
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: `Submitted by User ID: ${ownerId}`,
                },
            },
        ],
    };

    try {
        const response = await axios.post(WEBHOOK_URL, embed);
        console.log('Discord notification sent:', response.status);
    } catch (error) {
        console.error('Error sending Discord notification:', error);
    }
};

export default sendDiscordNotification;
