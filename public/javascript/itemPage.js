

console.log("itemPage.js loaded");

existingNames = [];

async function test(){

    let message =""
    let data =  await fetch('/items?operation=fetchNames', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json())
 
    var existingItemSelctor = document.getElementById("itemSelector");
    existingItemSelctor.options.length = 0;

    for (let i = 0; i < data.length; i++) {
        existingItemSelctor.add(new Option(data[i].name, data[i]._id));
        existingNames.push(data[i].name.toUpperCase());
    }


    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("ageRequirement").value = "";
    document.getElementById("quantity").value = "";


    console.log(data);
}

async function loadItem(){
    const selection = document.getElementById("itemSelector").value;
    console.log(selection);
    let data2 =  await fetch(`/items?operation=fetchItem&id=${selection}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => response.json())
    console.log(data2);
    document.getElementById("name").value = data2.name;
    document.getElementById("price").value = data2.price;
    document.getElementById("category").value = data2.category;
    document.getElementById("ageRequirement").value = data2.ageRequirement;
    document.getElementById("quantity").value = data2.quantity;
}

async function addItem(){
    console.log("createItem");
    if(existingNames.includes(document.getElementById("name").value.toUpperCase())){
        alert("Item already exists");
        return;
    }
    let data =  await fetch('/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify(
            {
                "name" : document.getElementById("name").value,
                "price" : document.getElementById("price").value,
                "category" : document.getElementById("category").value,
                "ageRequirement" : document.getElementById("ageRequirement").value,
                "quantity" : document.getElementById("quantity").value
            })
    }).then(response => response.json())
    test();

}

async function updateItem(){

    let newItem = []

    if(document.getElementById("name").value != ""){
        newItem.push({
            key : "name",
            value : document.getElementById("name").value
        });
    }
    if(document.getElementById("price").value != ""){
        newItem.push({
            key : "price",
            value : document.getElementById("price").value
        });
    }
    if(document.getElementById("category").value != ""){
        newItem.push({
            key : "category",
            value : document.getElementById("category").value
        });
    }
    if(document.getElementById("ageRequirement").value != ""){
        newItem.push({
            key : "ageRequirement",
            value : document.getElementById("ageRequirement").value
        });
    }
    if(document.getElementById("quantity").value != ""){
        newItem.push({
            key : "quantity",
            value : document.getElementById("quantity").value
        });
    }

    console.log(newItem);

    let data =  await fetch('/items', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify(
            {
                "id" :document.getElementById("itemSelector").value,
                "newItemValues" : newItem
                
            })
    }).then(response => response.json()).then(test());
    
}

async function deleteItem(){
    console.log("deleteItem");
    let data =  await fetch('/items', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body : JSON.stringify(
            {
                "operation" : "deleteSingle",
                "id" : document.getElementById("itemSelector").value
            })
    }).then(response => response.json())
    test();

}


test();

