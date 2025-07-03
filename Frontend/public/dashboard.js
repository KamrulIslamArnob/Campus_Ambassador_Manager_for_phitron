// --- Modal Control ---
const updateScoreBtn = document.getElementById('updateScoreBtn');
const closeUpdateModalBtn = document.getElementById('closeUpdateModalBtn');
const updateScoreModal = document.getElementById('updateScoreModal');

function openModal() {
    updateScoreModal.classList.remove('opacity-0', 'pointer-events-none');
    updateScoreModal.querySelector('.modal-content').classList.remove('scale-95');
    // Clear and focus search input
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        // Fetch all names for initial suggestions
        fetch('http://localhost:5000/api/ambassadors/search?name=')
            .then(res => res.json())
            .then(data => {
                suggestions = data;
                showAutocomplete(suggestions);
            });
    }
}

function closeModal() {
    updateScoreModal.querySelector('.modal-content').classList.add('scale-95');
    updateScoreModal.classList.add('opacity-0');
    // Wait for transition to finish before disabling pointer events
    setTimeout(() => {
        updateScoreModal.classList.add('pointer-events-none');
    }, 300);
}

let allAmbassadors = [];

if (updateScoreBtn) {
    updateScoreBtn.addEventListener('click', function() {
        // Fetch all ambassador info when opening the modal
        fetch('http://localhost:5000/api/ambassadors/')
            .then(res => res.json())
            .then(data => {
                allAmbassadors = data;
                // You can use allAmbassadors for further logic (e.g., show in modal, update scores, etc.)
                console.log('All Ambassadors:', allAmbassadors);
            });
        openModal();
    });
}
if (closeUpdateModalBtn) {
    closeUpdateModalBtn.addEventListener('click', closeModal);
}

// Close modal if backdrop is clicked
if (updateScoreModal) {
    updateScoreModal.addEventListener('click', (e) => {
        if (e.target === updateScoreModal) {
            closeModal();
        }
    });
}

// --- Autocomplete for Ambassador Name ---
const searchInput = document.getElementById('searchAmbassador');
const autocompleteList = document.getElementById('autocompleteList');
let debounceTimeout;
let activeIndex = -1;
let suggestions = [];

function clearAutocomplete() {
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');
    activeIndex = -1;
    suggestions = [];
}

function showAutocomplete(items) {
    if (!items.length) {
        clearAutocomplete();
        return;
    }
    autocompleteList.innerHTML = items.map((name, idx) =>
        `<div class="autocomplete-item${idx === activeIndex ? ' active' : ''}" data-index="${idx}">${name}</div>`
    ).join('');
    autocompleteList.classList.remove('hidden');
}

searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    clearAutocomplete();
    if (!query) return;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        fetch(`http://localhost:5000/api/ambassadors/search?name=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                suggestions = data;
                showAutocomplete(suggestions);
            });
    }, 200);
});

// Keyboard navigation
searchInput.addEventListener('keydown', function(e) {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
        activeIndex = (activeIndex + 1) % suggestions.length;
        showAutocomplete(suggestions);
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
        showAutocomplete(suggestions);
        e.preventDefault();
    } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
            searchInput.value = suggestions[activeIndex];
            clearAutocomplete();
            e.preventDefault();
        }
    }
});

// Click selection
autocompleteList.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('autocomplete-item')) {
        const idx = +e.target.getAttribute('data-index');
        searchInput.value = suggestions[idx];
        clearAutocomplete();
    }
});

// Hide autocomplete on blur
searchInput.addEventListener('blur', function() {
    setTimeout(clearAutocomplete, 150);
});

// --- Dynamic Total Members Count ---
function updateTotalMembersCount() {
    fetch('http://localhost:5000/api/ambassadors/')
        .then(res => res.json())
        .then(data => {
            const count = Array.isArray(data) ? data.length : 0;
            document.getElementById('totalMembersCount').textContent = count;
        })
        .catch(() => {
            document.getElementById('totalMembersCount').textContent = 'N/A';
        });
}
updateTotalMembersCount();

// --- Add Score Form Submission ---
const updateScoreForm = updateScoreModal.querySelector('form');
updateScoreForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = searchInput.value.trim();
    const scoreToAdd = Number(document.getElementById('scoreToAdd').value);
    if (!name || isNaN(scoreToAdd)) {
        alert('Please select an ambassador and enter a valid score.');
        return;
    }
    // Find ambassador by name (case-insensitive)
    const ambassador = allAmbassadors.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (!ambassador) {
        alert('Ambassador not found.');
        return;
    }
    const newScore = (ambassador.score || 0) + scoreToAdd;
    try {
        const res = await fetch(`http://localhost:5000/api/ambassadors/${ambassador._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newScore })
        });
        if (!res.ok) throw new Error('Failed to update score');
        closeModal();
        updateTotalMembersCount();
        alert('Score updated successfully!');
    } catch (err) {
        alert('Error updating score.');
    }
}); 