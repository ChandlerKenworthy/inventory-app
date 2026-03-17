import { useState, useEffect } from 'react'
import './App.css'

type InventoryItem = {
  product_id: number,
  quantity: number
  aisle: number
  shelf: number
  bin: number
}

function App() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  const fetchInventory = () => {
    fetch('/api/inventory')
    .then(res => res.json())
    .then(data => setInventory(data));
  }

  async function addItem() {
    await fetch("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: 1221,
        quantity: 12,
        aisle: 1,
        shelf: 2,
        bin: 3
      })
    });
    fetchInventory();
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
     <div className='wrapper'>
      <h1 className='title'>Current Stock</h1>
      <button onClick={addItem}>Add Item</button>

      <div className='table-wrapper'>
        <div className='table-headings'>
          <h3>Product ID</h3>
          <h3>Quantity</h3>
          <h3>Aisle</h3>
          <h3>Shelf</h3>
          <h3>Bin</h3>
        </div>
        <div className='table-body'>
          {inventory.map(item => (
            <div key={item.product_id} className='table-row'>
              <p>{item.product_id}</p>
              <p>{item.quantity}</p>
              <p>{item.aisle}</p>
              <p>{item.shelf}</p>
              <p>{item.bin}</p>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  )
}

export default App
