document.addEventListener('DOMContentLoaded', function() {
    loadSchedule();
    updateDateTime();
    displayQuoteOfTheDay();
});

document.getElementById('gymScheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule = {};

    days.forEach(day => {
        schedule[day] = document.getElementById(day).value;
    });

    const nextMonday = getNextMonday();
    localStorage.setItem('gymSchedule', JSON.stringify(schedule));
    localStorage.setItem('scheduleExpiry', nextMonday);

    displaySchedule(schedule);
});

document.getElementById('resetButton').addEventListener('click', function() {
    localStorage.removeItem('gymSchedule');
    localStorage.removeItem('scheduleExpiry');
    localStorage.removeItem('completedDays');
    document.getElementById('gymScheduleForm').reset();
    document.getElementById('scheduleList').innerHTML = '';
});

function loadSchedule() {
    const schedule = JSON.parse(localStorage.getItem('gymSchedule'));
    const expiryDate = localStorage.getItem('scheduleExpiry');
    const completedDays = JSON.parse(localStorage.getItem('completedDays')) || {};

    if (schedule && new Date() < new Date(expiryDate)) {
        displaySchedule(schedule, completedDays);
    } else {
        localStorage.removeItem('gymSchedule');
        localStorage.removeItem('scheduleExpiry');
        localStorage.removeItem('completedDays');
    }
}

function displaySchedule(schedule, completedDays = {}) {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = ''; // Clear existing schedule

    for (const [day, workout] of Object.entries(schedule)) {
        const listItem = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completedDays[day] || false;
        checkbox.addEventListener('change', function() {
            completedDays[day] = this.checked;
            localStorage.setItem('completedDays', JSON.stringify(completedDays));
            if (this.checked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
        });

        if (checkbox.checked) {
            listItem.classList.add('completed');
        }

        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(`${capitalizeFirstLetter(day)}: ${workout}`));
        scheduleList.appendChild(listItem);
    }
}

function getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    return nextMonday.toISOString().split('T')[0];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
}

function displayQuoteOfTheDay() {
    const quotes = [
        "Push yourself because no one else is going to do it for you.",
        "Success starts with self-discipline.",
        "The body achieves what the mind believes.",
        "Train insane or remain the same.",
        "The only bad workout is the one that didn’t happen.",
        "Your body can stand almost anything. It’s your mind that you have to convince.",
        "What seems impossible today will one day become your warm-up."
    ];

    const today = new Date();
    const quoteIndex = today.getDay(); // Use the day of the week to select a quote
    const quoteElement = document.getElementById('quote');
    quoteElement.textContent = quotes[quoteIndex];
}
