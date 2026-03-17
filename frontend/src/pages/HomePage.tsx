import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
        <div className='page-container'>
            <Navbar />
            <div className='content-container'>
                <h1 className="page-title">Home</h1>
            </div>
        </div>
    )
}