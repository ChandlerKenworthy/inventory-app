import Navbar from "../components/Navbar";
import NumberInput from "../components/forms/NumberInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InventoryItemSchema, { type NewInventoryItemFormData } from "../schema/InventoryItemSchema";
import "../styles/UpdateInventoryForm.css";

interface InventoryFormProps {
	onSuccess: () => void;
}

export function InventoryForm({ onSuccess }: InventoryFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<NewInventoryItemFormData>({
		resolver: zodResolver(InventoryItemSchema),
		mode: "onChange",
		defaultValues: {
			product_id: 0,
			quantity: 0,
			aisle: 0,
			shelf: 0,
			bin: 0
		},
	});

	const onSubmit = async (data: NewInventoryItemFormData) => {
		await fetch("/api/inventory", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		reset();
		onSuccess();
	};

	return (
		<form className="inventory-form" onSubmit={handleSubmit(onSubmit)}>
			<NumberInput 
				label="product_id" 
				description="Product ID" 
				error={errors.product_id?.message}
				{...register("product_id")} 
			/>
			<NumberInput 
				label="quantity" 
				description="Quantity" 
				error={errors.quantity?.message}
				{...register("quantity")} 
			/>
			<NumberInput 
				label="aisle" 
				description="Aisle" 
				error={errors.aisle?.message}
				{...register("aisle")} 
			/>
			<NumberInput 
				label="shelf" 
				description="Shelf" 
				error={errors.shelf?.message}
				{...register("shelf")} 
			/>
			<NumberInput 
				label="bin" 
				description="Bin" 
				error={errors.bin?.message}
				{...register("bin")} 
			/>
			<button type="submit">Update Inventory</button>
		</form>
	);
}

export default function UpdateInventoryPage() {
	return (
		<div className="page-container">
			<Navbar />
			<div className="content-container">
				<h1 className="page-title">Update Inventory</h1>
				<InventoryForm onSuccess={() => {}} />
			</div>
		</div>
	);
}