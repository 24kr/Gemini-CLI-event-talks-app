document.addEventListener('DOMContentLoaded', () => {
    // The 'talks' and 'schedule' variables will be injected by the build script.
    const talkData = talks;
    const scheduleSlots = schedule;

    const scheduleContainer = document.getElementById('schedule-container');
    const searchBar = document.getElementById('search-bar');

    const createTalkCard = (talk) => {
        const card = document.createElement('div');
        card.className = 'talk-card';
        card.dataset.categories = talk.category.join(',').toLowerCase();

        const categoriesHTML = talk.category.map(cat => `<span class="category">${cat}</span>`).join('');

        card.innerHTML = `
            <h3>${talk.title}</h3>
            <p class="speakers">by ${talk.speakers.join(', ')}</p>
            <p class="description">${talk.description}</p>
            <div class="categories">${categoriesHTML}</div>
        `;
        return card;
    };

    const createBreakCard = (text) => {
        const card = document.createElement('div');
        card.className = 'break-card';
        card.textContent = text;
        return card;
    };

    const renderSchedule = () => {
        let talkIndex = 0;
        scheduleSlots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';

            const timeElement = document.createElement('div');
            timeElement.className = 'time';
            timeElement.textContent = slot.time;

            let cardElement;
            if (slot.type === 'talk') {
                cardElement = createTalkCard(talkData[talkIndex]);
                talkIndex++;
            } else {
                cardElement = createBreakCard(slot.title);
            }

            slotElement.appendChild(timeElement);
            slotElement.appendChild(cardElement);
            scheduleContainer.appendChild(slotElement);
        });
    };

    const filterTalks = () => {
        const query = searchBar.value.toLowerCase().trim();
        const talkCards = document.querySelectorAll('.talk-card');

        talkCards.forEach(card => {
            const categories = card.dataset.categories;
            const timeSlot = card.parentElement;

            if (!query || categories.includes(query)) {
                timeSlot.style.display = 'flex';
                card.classList.remove('hidden');
            } else {
                timeSlot.style.display = 'none';
                card.classList.add('hidden');
            }
        });
    };

    searchBar.addEventListener('input', filterTalks);

    renderSchedule();
});
