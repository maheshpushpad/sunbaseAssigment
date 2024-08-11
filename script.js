let jwtToken = '';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            jwtToken = data.token;
            showCustomerList();
        } else {
            document.getElementById('login-error').innerText = 'Invalid credentials';
        }
    })
    .catch(error => console.error('Error:', error));
}

function showCustomerList() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('customer-list-screen').style.display = 'block';
    document.getElementById('customer-form-screen').style.display = 'none';

    fetch('http://localhost:8080/api/customers', {
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('customer-table').querySelector('tbody');
        tableBody.innerHTML = '';

        data.content.forEach(customer => {
            const row = `<tr>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <button onclick="editCustomer(${customer.id})">Edit</button>
                    <button onclick="deleteCustomer(${customer.id})">Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
}

function showAddCustomerForm() {
    document.getElementById('customer-list-screen').style.display = 'none';
    document.getElementById('customer-form-screen').style.display = 'block';
    document.getElementById('form-title').innerText = 'Add Customer';
    clearForm();
}

function saveCustomer() {
    const customer = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        street: document.getElementById('street').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    fetch('http://localhost:8080/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        showCustomerList();
    })
    .catch(error => console.error('Error:', error));
}

function editCustomer(id) {
    // Fetch customer details and show in form for editing
}

function deleteCustomer(id) {
    fetch(`http://localhost:8080/api/customers/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwtToken
        }
    })
    .then(response => {
        showCustomerList();
    })
    .catch(error => console.error('Error:', error));
}

function clearForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('street').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
}
