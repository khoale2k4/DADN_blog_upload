import contants from '../core/contants'

export async function uploadFile(file, url) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(url, {
            method: "PUT",
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return contants.getFileEndpoint + "/" + data.fileName;
    } catch (error) {
        return '/src/assets/not-found.png';
    }
}
