
<script>
import { ref, onMounted } from 'vue';


export default {
  setup() {

  const testData = ref([]);


  async function get_test_data() {
    try{
      const response = await fetch('http://10.0.0.156:8080/test')
      const data = await response.json()
      testData.value = data.test
      console.log(data)
    } catch(error) {
      console.error('There was an error fetching the data:', error)
    }
  }

  onMounted(get_test_data) 

  return {
    testData,
    get_test_data
  }
    


    }
}
</script>


<template>
  <div class="list-container">
    <h2>Test Data List</h2>
    <ul class="test-list">
      <li v-for="test in testData" :key="test" class="test-item">{{ test }}</li>
      
    </ul>
  </div>
</template>
