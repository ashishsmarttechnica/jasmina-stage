import DynamicPage from "./DynamicPage";

// 👇 server-only metadata export
export async function generateMetadata({ params }) {
    if (params.slag === "jasmina-imprint") {
        return {
            robots: {
                index: false,
                follow: false,
            },
        };
    }
    return {};
}

export default function Page() {
    return <DynamicPage />;
}
