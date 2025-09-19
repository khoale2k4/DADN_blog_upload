import contants from '../core/contants'

export default async function downloadHtml(id) {
    try {
        const res = await fetch(contants.getFileEndpoint + `/${id}.html`);
        if (!res.ok) throw new Error("Không tải được file HTML");
        const html = await res.text();
        return html;
    } catch (err) {
        console.error("Lỗi khi tải HTML:", err);
    }
};