import axios from "axios";

const uploadFileProgress = async (file, uploadUrl, onProgress) => {
    await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
        },
    });
};
