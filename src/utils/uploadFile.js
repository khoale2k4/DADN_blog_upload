import contants from '../core/contants'

export async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(contants.uploadFileEndpoint);

    const res = await fetch(contants.uploadFileEndpoint, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return contants.getFileEndpoint + "/" + data.fileName;
}
