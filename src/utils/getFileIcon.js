export default function getFileIcon(fileName) {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
        case "pdf":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/></svg>`;
        case "doc":
        case "docx":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/></svg>`;
        case "xls":
        case "xlsx":
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z"/></svg>`;
    }
};