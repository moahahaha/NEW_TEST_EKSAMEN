
<script>
import { ref, onMounted } from 'vue'; //impport Vue composition API functions

export default {
  setup() {

    const testData = ref([]); // store test items
    const newTest = ref(''); //store input data
    const books = ref([]); //book data

    const newBook = ref({ ISBN: '', Tittel: '', Publiseringsar: '', AvdelingID: '' }); //store ny book dataen



// fetch data bøker fra backend
    async function fetchBooks() {
      try {
        const response = await fetch('http://10.0.0.156/books');//send HTTP GET request til URL for å fetche data fra backend server
        const data = await response.json(); //parse JSON responsen til javascript object
        books.value = data.books; //gjør array book objects til en reactiv vue.js variable
        console.log("Books data:", data);
      } catch (error) {
        console.error('There was an error fetching the books:', error);
      }
    }



    async function fetchTestData() {
      try {
        const response = await fetch('http://10.0.0.156/test');
        const data = await response.json();
        testData.value = data;
        console.log("Test data:", data);
      } catch (error) {
        console.error('There was an error fetching the test data:', error);
      }
    }




    async function addTest() {
      try {
        const response = await fetch('http://10.0.0.156/test', {
          method: 'POST', //use POST method to add new item
          headers: {
            'Content-Type': 'application/json' //set request content type til JSON
          },
          body: JSON.stringify({ testItem: newTest.value }) //legg ny tets item i request body
        });
        if (response.ok) {
          fetchTestData(); // Call fetchTestData to update the test list
          newTest.value = '';
        } else {
          console.error('Failed to add test:', await response.text());
        }
      } catch (error) {
        console.error('There was an error adding the test:', error);
      }
    }

    async function deleteTest(test) {
      try {
        const response = await fetch(`http://10.0.0.156/test/${test}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchTestData();
        } else {
          console.error('Failed o delete test', await response.text())
        }
      } catch (error) {
        console.error('There was an error deleting the task', error)
      }
    }


    async function addBook() {
      try {
        const response = await fetch('http://10.0.0.156/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newBook.value)
        });
        if (response.ok) {
          fetchBooks();
          newBook.value = { ISBN: '', Tittel: '', Publiseringsar: '', AvdelingID: '' };
        } else {
          console.error('Failed to add book:', await response.text());
        }
      } catch (error) {
        console.error('There was an error adding the book:', error);
      }
    }




    async function deleteBook(bookISBN) {
      try {
        const response = await fetch(`http://10.0.0.156/books/${bookISBN}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchBooks();
        } else {
          console.error('Failed to delete book:', await response.text());
        }
      } catch (error) {
        console.error('There was an error deleting the book:', error);
      }
    }



    onMounted(() => {
      fetchTestData();
      fetchBooks();
    });




    return {
      testData,
      newTest,
      addTest,
      books,
      newBook,
      addBook,
      deleteBook,
      deleteTest
    };
  }
};
</script>

<template>
  <div class="list-container">


    <h2>Bøker:</h2>

    <input type="text" v-model="newBook.ISBN" placeholder="ISBN">
    <input type="text" v-model="newBook.Tittel" placeholder="Enter Title">
    <input type="text" v-model="newBook.Publiseringsar" placeholder="Publiseringsår">
    <input type="text" v-model="newBook.AvdelingID" placeholder="Avdelings ID">

    <button @click="addBook">Add Book</button>

    <table>
      <tr v-for="book in books" :key="book.ISBN">
        <td>{{ book.ISBN }}</td>
        <td>{{ book.Tittel }}</td>
        <td>{{ book.Publiseringsar }}</td>
        <td>{{ book.AvdelingID }}</td>
        <td><button @click="deleteBook(book.ISBN)">Delete book</button></td>
      </tr>
    </table>

    <br><br>

    <h1>test</h1>
    <input type="text" v-model="newTest" placeholder="Enter Test Item">

    <button @click="addTest">Add Test</button>

      <ul class="test-list">
      <li v-for="test in testData" :key="test" class="test">{{ test }} <button @click="deleteTest(test)">Delete</button></li> 
    </ul>
  </div>


</template>
