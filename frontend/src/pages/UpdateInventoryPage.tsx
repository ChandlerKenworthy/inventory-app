import Navbar from "../components/Navbar";
import { useState } from "react";
import type { InventoryItem } from "../Types";
import "../styles/Page.css";
import "../styles/UpdateInventoryForm.css";
import NumberInput from "../components/forms/NumberInput";

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
					<NumberInput label="product_id" description="Product ID" value={product.product_id} onChange={handleChange} min={1}/>
					<NumberInput label="quantity" description="Quantity" value={product.quantity} onChange={handleChange} min={0} />
					<NumberInput label="aisle" description="Aisle" value={product.aisle} onChange={handleChange} min={1} max={999} />
					<NumberInput label="shelf" description="Shelf" value={product.shelf} onChange={handleChange} min={1} max={999} />
					<NumberInput label="bin" description="Bin" value={product.bin} onChange={handleChange} min={1} max={10} />
					<button type="submit">Update Inventory</button>
				</form>
			</div>
		</div>
	);
}