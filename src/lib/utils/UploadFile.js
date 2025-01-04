import axios from 'axios';
import FormData from 'form-data';

const API_TOKEN = 'mdl1dDdIzRnlcN45ejrIdh2FeugAU1Ai';

const uploadFile = async (file) => {
    try {
        const serverResponse = await axios.get('https://api.gofile.io/servers');
        const server = serverResponse.data.data.servers[0].name;

        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axios.post(`https://${server}.gofile.io/contents/uploadfile`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${API_TOKEN}`,
            },
        });

        const fileData = uploadResponse.data.data;

        const attachmentDetails = {
            fileName: file.name,
            fileUrl: fileData.downloadPage,
            extention: file.name.split('.').pop(),
            size: file.size,
            fileType: file.type,
        };

        return attachmentDetails;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFile;