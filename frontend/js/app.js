const api_url = 'http://localhost:80';

async function makeRequest(url, method="GET", data=null) {

    const options = {method, headers: {}};

    if (data !== null) {
        options.body = JSON.stringify(data);
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error.message);
    };
};

function showBook(book) {

    const books_list = document.getElementById('books-collection');
    const status = book[5] ? "Completed": "Pending";

    books_list.innerHTML += 
        `<li>
            <div><span class="title">${book[2]}</span><span class="author">${book[3]}</span></div>
            <div><span class="isbn">${book[1]}</span><span class="year">${book[4]}</span></div>
            <div><button class="delete" data-id="${book[0]}">Delete</button><div class="status" data-id="${book[0]}" data-status="${book[5]}">${status}</div></div>
        </li>`;
};

async function loadBooks() {
    try {
        const path = new URL('library', api_url).href;
        const response = await makeRequest(path);
        response.forEach(book => {
            try {
                showBook(book);
            } catch (err) {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    };
};

function reloadPage() {
    setTimeout(() => {
        location.reload();
    }, 1000);
};

function openModal() {
    const add_modal = document.getElementById("book-modal");
    window.addEventListener("click", function (event) {
    if (event.target == add_modal) {
        add_modal.style.display = "none";
    }
    });
    add_modal.style.display = "block";
};

const add_button = document.getElementById("add-btn");
const add_form = document.getElementById("add-form");
add_button.addEventListener("click", async (e) => {

    e.preventDefault();
    const formData = new FormData(add_form);
    const title = add_form.elements["title"]?.value.trim();
    const author = add_form.elements["author"]?.value.trim();
    const yearRaw = add_form.elements["year"]?.value.trim();

    if (!title || !author) {
        alert("Title and Author are required");
        return;
    }

    if (yearRaw) {
        const yearNum = Number(yearRaw);
        if (!Number.isInteger(yearNum)) {
            alert("Publication Year must be a valid number");
            return;
        }
        if (yearNum > 2026) {
            alert("Publication Year cannot be greater than 2026");
            return;
        }
    }

    const data = Object.fromEntries(formData.entries());
    const path = new URL("/add-book", api_url).href;
    const result = await makeRequest(path, "POST", data);
    console.log("Server:", result);
    reloadPage()
});

const search_modal = document.getElementById("search-modal");
const search_text = document.getElementById("search-text");
const search_box = document.getElementById("search-box");

function searchModal() {
    window.addEventListener("click", function (event) {
    if (event.target == search_modal) {
        search_modal.style.display = "none";
        search_box.innerHTML = "";
        search_text.value = "";
    }
    });
    search_modal.style.display = "block";
};

function loadSearch(data) {

    const search_box = document.getElementById('search-box')
    search_box.innerHTML += 
        `<li>
            <div><span class="title">${data['title']}</span><span class="author">${data['author_name']}</span></div>
            <div><span class="isbn">${data['author_key']}</span><span class="year">${data['first_publish_year']}</span></div>
            <div><button 
                class="add-from-search" 
                data-title="${data['title']}" 
                data-author="${data['author_name']}" 
                data-isbn="${data['author_key']}"
                data-year="${data['first_publish_year']}"
            >Add</button></div>
        </li>`;
}

document.getElementById("search-box").addEventListener("click", (e) => {

    if (!e.target.classList.contains("add-from-search")) return;

    const replace_btn = e.target;
    const add_form = document.getElementById("add-form");
    add_form.elements["title"].value = replace_btn.dataset.title;
    add_form.elements["author"].value = replace_btn.dataset.author;
    add_form.elements["isbn"].value = replace_btn.dataset.isbn;
    add_form.elements["year"].value = replace_btn.dataset.year;

    search_modal.style.display = "none";
    search_box.innerHTML = "";
    search_text.value = "";
    openModal();
});

const search_button = document.getElementById("search-btn");
search_button.addEventListener("click", async (e) => {

    const search_text = document.getElementById("search-text").value;
    e.preventDefault();

    response = await makeRequest(`https://openlibrary.org/search.json?limit=20&q=${search_text}`)
    response['docs'].forEach(book => {
        try {
            loadSearch(book);
        } catch (err) {
            console.log(err);
        }
    });
    console.log("API response:", response);
});

document.getElementById("books-collection").addEventListener("click", async (e) => {
    
    const btn = e.target.closest("button.delete");
    if (!btn) return;

    const id = btn.dataset.id;
    const path = new URL(`/delete-book/${id}`, api_url).href;
    const response = await makeRequest(path, "DELETE");
    console.log("Response:", response);
    reloadPage();

});

document.getElementById("books-collection").addEventListener("click", async (e) => {
    
    const status = e.target.closest("div.status");
    if (!status) return;

    const id = status.dataset.id;
    const path = new URL(`/update-status/${id}`, api_url).href;
    const response = await makeRequest(path, "PUT");
    console.log("Response:", response);
    reloadPage();

});

document.addEventListener("DOMContentLoaded", function() {
    loadBooks();
});