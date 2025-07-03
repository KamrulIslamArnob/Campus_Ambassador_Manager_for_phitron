document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api/ambassadors';
    let membersData = []; // To store and filter members

    // --- DOM Elements ---
    const addMemberBtn = document.getElementById('addMemberBtn');
    const memberModal = document.getElementById('memberModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const memberForm = document.getElementById('memberForm');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const searchInput = document.getElementById('search');
    const tableBody = document.querySelector('tbody');
    const addJsonBtn = document.getElementById('addJsonBtn');
    const jsonModal = document.getElementById('jsonModal');
    const jsonForm = document.getElementById('jsonForm');
    const jsonInput = document.getElementById('jsonInput');
    const jsonError = document.getElementById('jsonError');

    // --- Modal Control ---
    const openModal = (modalElement) => {
        modalElement.classList.remove('opacity-0', 'pointer-events-none');
        modalElement.querySelector('.modal-content').classList.remove('scale-95');
    };

    const closeModal = (modalElement) => {
        modalElement.querySelector('.modal-content').classList.add('scale-95');
        modalElement.classList.add('opacity-0');
        setTimeout(() => modalElement.classList.add('pointer-events-none'), 300);
    };

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(memberModal);
            closeModal(deleteConfirmModal);
            closeModal(jsonModal);
        });
    });

    // --- Data Fetching and Rendering ---
    const formatNumber = (num) => num.toLocaleString();

    const renderMembers = (members) => {
        tableBody.innerHTML = '';
        if (members.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-400">No members found.</td></tr>`;
            return;
        }
        members.forEach(member => {
            const tr = document.createElement('tr');
            tr.className = 'table-row-hover';
            tr.innerHTML = `
                <td class="p-4 font-medium text-white whitespace-nowrap">${member.name}</td>
                <td class="p-4 whitespace-nowrap">${member.university}</td>
                <td class="p-4 whitespace-nowrap">${member.phone}</td>
                <td class="p-4 whitespace-nowrap font-semibold text-gold-light">${formatNumber(member.score)}</td>
                <td class="p-4 whitespace-nowrap">${member.CA_batch}</td>
                <td class="p-4 whitespace-nowrap text-right">
                    <button class="edit-btn text-blue-400 hover:text-blue-300 mr-2 p-1" data-id="${member._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen pointer-events-none"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                    </button>
                    <button class="delete-btn text-danger-DEFAULT hover:text-danger-hover p-1" data-id="${member._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 pointer-events-none"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    };

    const fetchMembers = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch members');
            membersData = await res.json();
            renderMembers(membersData);
        } catch (error) {
            console.error("Failed to fetch members:", error);
            tableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-red-400">Error loading data.</td></tr>`;
        }
    };
    
    // --- CRUD Logic ---
    
    // CREATE / UPDATE
    addMemberBtn.addEventListener('click', () => {
        memberForm.reset();
        document.getElementById('memberId').value = '';
        modalTitle.textContent = 'Add New Member';
        modalSubmitBtn.textContent = 'Save Member';
        openModal(memberModal);
    });

    memberForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('memberId').value;
        const memberData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            university: document.getElementById('university').value,
            phone: document.getElementById('phone').value,
            CA_batch: document.getElementById('ca_batch').value,
            score: Number(document.getElementById('score').value),
            // For new ambassador, set totalPoints and leaderboardPosition to score and 0 by default
            totalPoints: Number(document.getElementById('score').value),
            leaderboardPosition: 0
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (!res.ok) throw new Error('Failed to save member');
            closeModal(memberModal);
            fetchMembers();
        } catch (error) {
            alert('Error saving member: ' + error.message);
        }
    });

    // EDIT (Handler attached to table body for delegation)
    tableBody.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            const member = membersData.find(m => m._id === id);
            if (member) {
                document.getElementById('memberId').value = member._id;
                document.getElementById('name').value = member.name;
                document.getElementById('email').value = member.email;
                document.getElementById('university').value = member.university;
                document.getElementById('phone').value = member.phone;
                document.getElementById('ca_batch').value = member.CA_batch;
                document.getElementById('score').value = member.score;
                modalTitle.textContent = 'Edit Member';
                modalSubmitBtn.textContent = 'Update Member';
                openModal(memberModal);
            }
        }
    });

    // DELETE (Handler attached to table body for delegation)
    tableBody.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = e.target.closest('.delete-btn').dataset.id;
            confirmDeleteBtn.dataset.id = id; 
            openModal(deleteConfirmModal);
        }
    });
    
    confirmDeleteBtn.addEventListener('click', async () => {
        const id = confirmDeleteBtn.dataset.id;
        try {
            const res = await fetch(`http://localhost:5000/api/ambassadors/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete member');
            closeModal(deleteConfirmModal);
            fetchMembers();
        } catch (error) {
            alert('Error deleting member: ' + error.message);
        }
    });

    // --- Search/Filter Logic ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMembers = membersData.filter(member => 
            member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm) ||
            member.university.toLowerCase().includes(searchTerm)
        );
        renderMembers(filteredMembers);
    });

    // --- Add via JSON Modal Logic ---
    addJsonBtn.addEventListener('click', () => {
        jsonInput.value = '';
        jsonError.textContent = '';
        openModal(jsonModal);
    });

    jsonForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        jsonError.textContent = '';
        let data;
        try {
            data = JSON.parse(jsonInput.value);
        } catch (err) {
            jsonError.textContent = 'Invalid JSON.';
            return;
        }
        // Accept both array and single object
        const members = Array.isArray(data) ? data : [data];
        let success = 0, fail = 0;
        for (const member of members) {
            try {
                const res = await fetch('http://localhost:5000/api/ambassadors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(member)
                });
                if (!res.ok) throw new Error('Failed');
                success++;
            } catch {
                fail++;
            }
        }
        if (success > 0) fetchMembers();
        closeModal(jsonModal);
        if (fail > 0) {
            alert(`${success} member(s) added. ${fail} failed.`);
        } else {
            alert(`${success} member(s) added successfully!`);
        }
    });

    // --- Initial Load ---
    fetchMembers();
}); 