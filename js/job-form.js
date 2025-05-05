document.addEventListener('DOMContentLoaded', function() {
    const openFormButton = document.querySelector('#jobs-btn button');
    const jobsPopup = document.querySelector('#jobs-popup');
    const closeFormButton = document.querySelector('.close-form-button');
    const jobForm = document.querySelector('#job-form');
    const jobSuccess = document.querySelector('#job-success');
  
    if (openFormButton && jobsPopup && closeFormButton && jobForm) {
      openFormButton.addEventListener('click', function() {
        jobsPopup.style.display = 'flex';
      });
  
      closeFormButton.addEventListener('click', function() {
        jobsPopup.style.display = 'none';
      });
  
      window.addEventListener('click', function(event) {
        if (event.target === jobsPopup) {
          jobsPopup.style.display = 'none';
        }
      });
  
      jobForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(jobForm);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });
  
        fetch('http://localhost:3000/submit-application', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text(); // Или response.json(), если сервер возвращает JSON
        })
        .then(responseData => {
          console.log('Ответ от сервера:', responseData);
          jobsPopup.style.display = 'none';
          if (jobSuccess) {
            jobSuccess.style.display = 'block';
          }
          jobForm.reset();
        })
        .catch(error => {
          console.error('Ошибка при отправке данных на сервер:', error);
        });
      });
    } else {
      console.error('Одна или несколько необходимых кнопок или элементов формы не найдены в DOM.');
    }
  });