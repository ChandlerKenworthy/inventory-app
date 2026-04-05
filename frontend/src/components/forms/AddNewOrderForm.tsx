import { zodResolver } from "@hookform/resolvers/zod";
import OrderItemSchema, { type NewOrderItemFormData } from "../../schema/OrderItemSchema";
import { useForm } from "react-hook-form";

interface AddNewOrderProps {
    onSuccess: () => void;
}

export default function AddNewOrderForm({ onSuccess }: AddNewOrderProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewOrderItemFormData>({
        resolver: zodResolver(OrderItemSchema),
        mode: "onChange",
        defaultValues: {
            // TODO: No more magic, use central defaults
        },
    });

    const onSubmit = async (data: NewOrderItemFormData) => {
        // TODO: call service to add new order
        reset(); // reset the form state
        onSuccess(); // call the onSuccess callback to trigger any parent updates
    };

    return (
        <p>Add new order form goes here</p>
    );
}