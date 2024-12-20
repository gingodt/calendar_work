document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const daysOffList = document.getElementById('days-off');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const holidayDateInput = document.getElementById('holiday-date');
    const addHolidayButton = document.getElementById('add-holiday-button');

    function loadDaysOff() {
        const daysOff = localStorage.getItem('daysOff');
        return daysOff ? JSON.parse(daysOff) : [];
    }

    function saveDaysOff(daysOff) {
        localStorage.setItem('daysOff', JSON.stringify(daysOff));
    }

    function loadHolidays() {
        const holidays = localStorage.getItem('holidays');
        return holidays ? JSON.parse(holidays) : [];
    }

    function saveHolidays(holidays) {
        localStorage.setItem('holidays', JSON.stringify(holidays));
    }

    function updateDaysOffList() {
        const daysOff = loadDaysOff();
        daysOffList.innerHTML = '';
        daysOff.forEach(day => {
            const li = document.createElement('li');
            li.textContent = day;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                const updatedDaysOff = daysOff.filter(d => d !== day);
                saveDaysOff(updatedDaysOff);
                updateDaysOffList();
                createCalendar(new Date(day).getFullYear(), new Date(day).getMonth());
            });
            li.appendChild(removeButton);
            daysOffList.appendChild(li);
        });
    }

    function createCalendar(year, month) {
        calendar.innerHTML = '';
        const date = new Date(year, month);
        const monthName = date.toLocaleString('default', { month: 'long' });
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const daysOff = loadDaysOff();
        const holidays = loadHolidays();

        const header = document.createElement('div');
        header.innerHTML = `<h2>${monthName} ${year}</h2>`;
        calendar.appendChild(header);

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.textContent = day;

            if (holidays.includes(dateStr)) {
                dayElement.classList.add('holiday');
            }

            if (daysOff.includes(dateStr)) {
                dayElement.classList.add('off');
            }

            dayElement.addEventListener('click', function() {
                dayElement.classList.toggle('off');
                const daysOff = loadDaysOff();
                if (dayElement.classList.contains('off')) {
                    daysOff.push(dateStr);
                    alert(`Reminder: You have marked ${dateStr} as a day off.`);
                } else {
                    const index = daysOff.indexOf(dateStr);
                    if (index > -1) {
                        daysOff.splice(index, 1);
                    }
                }
                saveDaysOff(daysOff);
                updateDaysOffList();
            });

            calendar.appendChild(dayElement);
        }
    }

    function populateMonthSelect() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });
    }

    function populateYearSelect() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 5; year <= currentYear + 5; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    monthSelect.addEventListener('change', function() {
        createCalendar(yearSelect.value, monthSelect.value);
    });

    yearSelect.addEventListener('change', function() {
        createCalendar(yearSelect.value, monthSelect.value);
    });

    prevMonthButton.addEventListener('click', function() {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        createCalendar(year, month);
    });

    nextMonthButton.addEventListener('click', function() {
        let month = parseInt(monthSelect.value);
        let year = parseInt(yearSelect.value);
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }
        monthSelect.value = month;
        yearSelect.value = year;
        createCalendar(year, month);
    });

    addHolidayButton.addEventListener('click', function() {
        const holidayDate = holidayDateInput.value;
        if (holidayDate) {
            const holidays = loadHolidays();
            holidays.push(holidayDate);
            saveHolidays(holidays);
            createCalendar(yearSelect.value, monthSelect.value);
        }
    });

    const today = new Date();
    populateMonthSelect();
    populateYearSelect();
    monthSelect.value = today.getMonth();
    yearSelect.value = today.getFullYear();
    createCalendar(today.getFullYear(), today.getMonth());
    updateDaysOffList();
});