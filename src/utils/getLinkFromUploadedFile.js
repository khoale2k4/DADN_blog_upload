export default function getIDFromDownloadLink(link) {
    try {
        return link.split('/')[6].split('.')[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}
