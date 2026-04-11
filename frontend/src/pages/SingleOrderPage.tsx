import { useParams } from "react-router-dom";
import Page from "../components/Page";

export default function SingleOrderPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <Page title="Order Details">
            <p>I am a single order with ID: {id}</p>
        </Page>
    )
}