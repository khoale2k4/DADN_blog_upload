export default async function downloadHtml(id) {
    try {
        const res = await fetch(`http://localhost:8080/api/files/download/${id}.html`);
        if (!res.ok) throw new Error("Không tải được file HTML");
        const html = await res.text();
        return html;
    } catch (err) {
        console.error("Lỗi khi tải HTML:", err);
    }
};