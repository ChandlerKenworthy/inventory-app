import { GoXCircle } from "react-icons/go";
import type { APIResponse } from "../Types";
import "../styles/components/FeedbackPopup.css";

export default function FeedbackPopup(
    { feedback, onClose } : { 
        feedback: { type: APIResponse, message: string }, 
        onClose: () => void 
    }) 
{
    return (
        <div className={`feedback-popup-wrapper ${feedback.type}`}>
            <p>{feedback.message}</p>
            <button
                onClick={onClose}
            >
                <GoXCircle fontSize={18} />
            </button>
        </div>
    );
}