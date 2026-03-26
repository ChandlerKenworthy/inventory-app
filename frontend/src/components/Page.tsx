import Navbar from "./Navbar";
import "../styles/components/Page.css";

export default function Page({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className='page-container'>
            <Navbar />
            <div className='content-container'>
                <h1 className="page-title">{title}</h1>
                <div className='page-content'>
                    {children}
                </div>
            </div>
        </div>
    )
}
