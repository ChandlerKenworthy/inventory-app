import Navbar from "../components/Navbar";
import { useState } from "react";
import type { InventoryItem } from "../types/Inventory";
import "../styles/Page.css";
import "../styles/UpdateInventoryForm.css";

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
					<div>
						<label htmlFor="product_id">Product ID:</label>
						<input name="product_id" placeholder="Product ID" value={product.product_id} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="quantity">Quantity:</label>
						<input name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="aisle">Aisle:</label>
						<input name="aisle" placeholder="Aisle" value={product.aisle} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="shelf">Shelf:</label>
						<input name="shelf" placeholder="Shelf" value={product.shelf} onChange={handleChange} />
					</div>
					<div>
						<label htmlFor="bin">Bin:</label>
						<input name="bin" placeholder="Bin" value={product.bin} onChange={handleChange} />
					</div>

					<button type="submit">Update Inventory</button>
				</form>
			</div>
		</div>
	);
}