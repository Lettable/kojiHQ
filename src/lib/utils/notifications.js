export const sendNotification = async (data) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send notification');
      }
  
      return await res.json();
    } catch (err) {
      console.error('Notification error:', err);
      return { success: false, message: err.message };
    }
  };
  