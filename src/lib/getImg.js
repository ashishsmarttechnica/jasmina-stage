export default function getImg(url) {
  if (url) {
    // If URL already starts with http, return as is
    if (url.startsWith("http")) {
      return url;
    }
    
    // Otherwise, construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";
    // Ensure baseUrl ends with / and url starts with / (or add it)
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    
    return `${cleanBaseUrl}${cleanUrl}`;
  }
}
