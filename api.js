const API_BASE_URL = "https://udyam-sakhi.onrender.com/api";

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data?.message || "Something went wrong"
        );
    }

    return data;
}

// Register
async function registerUser(userData) {
    return await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

// Login
async function loginUser(email, password) {
    return await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
}

// Get all users
async function getAllUsers() {
    return await apiRequest("/auth/users");
}

// Get user by ID
async function getUserById(id) {
    return await apiRequest(`/auth/user/${id}`);
}

// Update user
async function updateUser(id, userData) {
    return await apiRequest(`/auth/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData)
    });
}

// Delete user
async function deleteUser(id) {
    return await apiRequest(`/auth/user/${id}`, {
        method: "DELETE"
    });
}