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