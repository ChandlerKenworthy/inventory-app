import Navbar from "../components/Navbar";
import { useState } from "react";
import type { InventoryItem } from "../Types";
import "../styles/Page.css";
import "../styles/UpdateInventoryForm.css";
import TextInput from "../components/forms/TextInput";

export default function UpdateInventoryPage() {
	const [product, setProduct] = useState<InventoryItem>({
		product_id: 0,
		quantity: 0,
		aisle: 0,
		shelf: 0,
		bin: 0
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProduct({
			...product,
			[e.target.name]: Number(e.target.value)
		});
	};

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		await fetch("/api/inventory", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(product)
		});

		setProduct({
			product_id: 0,
			quantity: 0,
			aisle: 0,
			shelf: 0,
			bin: 0
		});
	}

	return (
		<div className="page-container">
			<Navbar />
			<div className="content-container">
				<h1 className="page-title">Update Inventory</h1>
				<form onSubmit={handleSubmit}>
					<TextInput label="product_id" description="Product ID" value={product.product_id} onChange={handleChange} />
					<TextInput label="quantity" description="Quantity" value={product.quantity} onChange={handleChange} />
					<TextInput label="aisle" description="Aisle" value={product.aisle} onChange={handleChange} />
					<TextInput label="shelf" description="Shelf" value={product.shelf} onChange={handleChange} />
					<TextInput label="bin" description="Bin" value={product.bin} onChange={handleChange} />
					<button type="submit">Update Inventory</button>
				</form>
			</div>
		</div>
	);
}