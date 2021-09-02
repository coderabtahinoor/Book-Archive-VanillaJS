const searchField = document.getElementById('search_field');
const booksContainer = document.getElementById('show_books');
const spinner = document.getElementById('loading_spinner');
const notFoundError = document.getElementById('result_not_found');
const searchCount = document.getElementById('show_search_count');
const blank_input_error = document.getElementById('show_blank_input_error');

//fetch the data 
const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//search handler
const searchHandler = (event) => {
    event.preventDefault();

    //get the value of input
    const searchText = searchField.value;

    //clear the previouis data 
    booksContainer.textContent = ' ';
    searchCount.textContent = ' ';
    blank_input_error.textContent = ' ';
    notFoundError.textContent = ' ';

    //handle the blank input error 
    if (searchField.value.length === 0) {
        notFoundError.textContent = ' ';
        blank_input_error.innerHTML = `
        <div class="alert alert-warning d-flex align-items-center mt-4" role="alert">
            <div>
                <h6 class="text-center">⚠ Please write something for find the book</h6>
            </div>
        </div>
        `

    } else {
        // show spinner 
        spinner.classList.remove("d-none");
        spinner.classList.add("d-flex");

        //get the data
        fetchData(`http://openlibrary.org/search.json?q=${searchText}`)
            .then(data => showBooks(data))
    }

    //clear the input
    searchField.value = '';

}

//show data
const showBooks = (booksData) => {

    //get the docs array
    const { docs } = booksData;

    //handle the error if the array  has no result
    showResultNotFound(booksData);

    docs.forEach(book => {
        spinner.classList.add('d-none');

        //handle image not found
        let book_image;
        if (book.cover_i === undefined) {
            book_image = "https://images-ext-1.discordapp.net/external/0HA2jhEDl46kUOozPYZxqltQ3vdBRvkSB2xr77PzbyM/%3Fq%3Dtbn%3AANd9GcQVIiNXO1UGEUca6N_ZRXpaxUXzAUqs_1KTCpXauiZOpAO6jrQ0XwivrGx3F9UJBNCzn8E%26usqp%3DCAU/https/encrypted-tbn0.gstatic.com/images";
        } else {
            book_image = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        }

        booksContainer.innerHTML += `
        <div>
        <div class="card" style="width: 18rem;">
        <img src=${book_image} class="card-img-top">
        <div class="card-body">
            <h4 class="card-title">${book.title}</h4>
            <h6 class="text-secondary">Author Name: <span class="text-primary">${book.author_name}</span></h6>
            <h6 class="text-secondary">Publisher Name: <span class="text-primary">${book.publisher}</span></h6>
            <h6 class="text-secondary">First Publish Year: <span class="text-primary">${book.first_publish_year}</span></h6>
        </div>
        </div>
        </div>
        `
    });
}


// show not found error and result count
const showResultNotFound = (booksData) => {
    if (booksData.numFound === 0) {
        notFoundError.innerHTML = `
        <div class="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <div>
                <h6 class="text-center">⚠ Result Not Found.</h6>
            </div>
        </div>
    `
        searchCount.textContent = ' ';
        spinner.classList.add("d-none");
    } else {

        //search result count
        searchCount.innerHTML = `
        <h3 class="text-secondary py-4"><span class="text-primary">${booksData.numFound}</span> results found</h3>
    `
    }

}

