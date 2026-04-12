import { zodResolver } from "@hookform/resolvers/zod";
import OrderItemSchema, { type NewOrderItemFormData } from "../../schema/OrderItemSchema";
import { useForm, useFieldArray } from "react-hook-form";
import { GoPlus, GoTrash } from "react-icons/go";
import type { CustomerItem, OrderItemRecord } from "../../Types";
import { orderService } from "../../services/orderService";

interface AddNewOrderProps {
    onSuccess: () => void;
    products: OrderItemRecord[];
    customers: CustomerItem[];
}

export default function AddNewOrderForm({ onSuccess, products, customers }: AddNewOrderProps) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<NewOrderItemFormData>({
        resolver: zodResolver(OrderItemSchema),
        mode: "onChange",
        defaultValues: { 
            customer_id: "",
            items: [{ product_id: "uuidv4-placeholder", quantity: 1 }] 
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const onSubmit = async (data: NewOrderItemFormData) => {
        const response = await orderService.send_order(data);
        reset(); // reset the form state
        if (response.success) {
            onSuccess(); // call the onSuccess callback to trigger any parent updates
        } else {
            alert("Failed to place order: " + response.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="order-form">
            <h3>Create New Order</h3>
            
            <div className="form-group">
                <label>Select Customer</label>
                <select {...register("customer_id")}>
                    <option value="">-- Choose a Customer --</option>
                    {customers.map(c => (
                        <option key={c.id as string} value={c.id as string}>
                            {c.first_name} {c.second_name}
                        </option>
                    ))}
                </select>
                {errors.customer_id && <span className="error">{errors.customer_id.message}</span>}
            </div>

            <hr />
            <h4>Products</h4>
            {fields.map((field, index) => {
                // Watch the selected product to check its inventory
                const selectedId = watch(`items.${index}.product_id`);
                const productInStock = products.find(p => p.product_id === selectedId);
                const maxStock = productInStock?.quantity || 0;

                return (
                    <div key={field.id} className="order-item-row">
                        <select {...register(`items.${index}.product_id` as const)}>
                            <option value="">Select Product</option>
                            {products.map(p => (
                                <option 
                                    key={p.product_id as string} 
                                    value={p.product_id as string} 
                                    disabled={p.quantity <= 0}>
                                    {p.product_name} ({p.quantity} in stock) (£{p.unit_price.toFixed(2)})
                                </option>
                            ))}
                        </select>

                        <input 
                            type="number" 
                            placeholder="Qty"
                            {...register(`items.${index}.quantity` as const)} 
                        />
                        
                        <button type="button" onClick={() => remove(index)}><GoTrash /></button>
                        
                        {/* Instant Inventory Validation Hint */}
                        {maxStock <= 0 && selectedId && (
                            <p className="error">Out of stock!</p>
                        )}
                    </div>
                );
            })}

            <button type="button" className="btn-secondary" onClick={() => append({ product_id: "", quantity: 1 })}>
                <GoPlus /> Add Product
            </button>

            <div className="form-actions">
                <p>Order total: £</p>
                <button type="submit" className="btn-primary">Place Order</button>
            </div>
        </form>
    );
}