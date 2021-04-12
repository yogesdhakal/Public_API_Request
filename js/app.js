//Creating the DOM Elements

const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
const gallery = document.querySelector('#gallery');
const modalWrapper = document.querySelector('.modal-wrapper');

// Create an empty array for users 

let users = [];


// Creating and adding the search form 

// Create & Add Search Field
const form = `
  <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;

searchContainer.innerHTML = form;






// Fetch the 12 users 

fetch('https://randomuser.me/api/?results=12')
  .then(response => response.json())
  .then(data => displayUsers(data.results))
  .catch(error => console.log(error));


// Function to display the users 
function displayUsers(usersData) {
    users = usersData;
    
    let userHTML = '';
  
    users.forEach((user, index) => {
      const { picture: {large}, name: {first, last}, email, location: {city, state} } = user;
  
      userHTML += `
        <div class="card" data-index="${index}">
          <div class="card-img-container">
              <img class="card-img" src="${large}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${first} ${last}</h3>
              <p class="card-text email">${email}</p>
              <p class="card-text cap">${city}, ${state}</p>
          </div>
        </div>
      `;
    });
  
    gallery.innerHTML = userHTML;
  }


    // Function to display the Modal Window

    function displayModal(index) {
        let { picture: {large}, name: {first, last}, email, location: {city, state, street, postcode}, cell, dob } = users[index];

    
        // User Regular Expression and the Date object to format the cell and DOB correctly

        cell = cell.replace(/-/g, '').replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
        dob = new Date(dob.date).toLocaleDateString();
      


        // Create the HTML for the modal Wrapper

        const modalHTML = `
            <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn" onclick="modalClose(this)"><strong>X</strong></button>
                <div class="modal-info-container">
                <img class="modal-img" src="${large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${first} ${last}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${city}</p>
                <hr>
                <p class="modal-text">${cell}</p>
                <p class="modal-text">${street.number} ${street.name}, ${city}, ${state} ${postcode}</p>
                <p class="modal-text">Birthday: ${dob}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
            </div>
        `;

        modalWrapper.innerHTML = modalHTML;
    }


    // Program the Events

    gallery.addEventListener('click', (e) => {
        if (e.target !== gallery) {
          const card = e.target.closest('.card');
          const index = card.getAttribute('data-index');
      
          // Display Modal Of Clicked User Profile
          displayModal(index);
      
          // Modal Toggle Function
          modalToggle(index);
        }
    })
      
      // Close Modal Window
      function modalClose(button) {
        button.parentElement.parentElement.style.display = 'none';
      }
      
      // Modal Toggle
      function modalToggle(index) {
        let counter = index;
      
        modalWrapper.addEventListener('click', (e) => {
          if (e.target.classList.contains('modal-next')) {
            if (counter < users.length - 1) {
              counter++;
            }
            else {
              counter = 0;
            }
      
            displayModal(counter);
          }
      
      
          if (e.target.classList.contains('modal-prev')) {
            if (counter > 0) {
              counter--;
            }
            else {
              counter = users.length - 1;
            }
      
            displayModal(counter);
          }
        })
      }

      // Event Listener for the User Search and Filter

      document.querySelector('#search-input').addEventListener('keyup', (e) => {
        e.preventDefault();
        
        if (e.target.value !== '') {
          const userValue = e.target.value.trim().toLowerCase();
          const usersOnDisplay = Array.from(gallery.querySelectorAll('.card'));
          
          for (let i = 0; i < usersOnDisplay.length; i++) {
            const name = usersOnDisplay[i].querySelector('#name').textContent.toLowerCase();
            
            if (!name.includes(userValue)) {
              usersOnDisplay[i].style.display = 'none';
      
            }
            else {
              usersOnDisplay[i].style.display = 'flex';
          
            }
          }
      
        }
        else {
          displayUsers(users);
        }
      
      })