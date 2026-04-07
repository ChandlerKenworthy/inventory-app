import { useState } from "react";
import Page from "../components/Page";
import "../styles/pages/CustomQueryPage.css";

export default function CustomQueryPage() {
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");

    const runQuery = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/query', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            if(!response.ok) {
                alert("Something unexpected happened.");
                setLoading(false);
                return;
            }
            const data = await response.json();
            setResult(JSON.stringify(data, null, 2));
        } catch (error) {
            alert("There was an error processing the query: " + error);
        }
        setLoading(false);
    }

    return (
        <Page title="Custom Query">
            <p>Enter your custom SQL query and get raw JSON back. (This is a dangerous security vulnerability and should be removed in production).</p>
            <div className="custom-sql-form">
                <div className="sql-form-group">
                    <label htmlFor="query">Custom SQL Query:</label>
                    <textarea
                        id="query"
                        name="query"
                        placeholder="SELECT * FROM products WHERE price > 100;"
                        required
                        className="custom-sql-input"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={runQuery}
                >
                    Run Query
                </button>
            </div>
            <h3>Response ({loading ? "Loading..." : "Done"})</h3>
            <textarea
                readOnly
                value={loading ? "Running query..." : result}
                className="custom-sql-response"
            />
        </Page>
    )
}