document.addEventListener('DOMContentLoaded', () => {
    const usernameSpan = document.getElementById('username');
    const logoutButton = document.getElementById('logoutButton');
    const newIdeaForm = document.getElementById('newIdeaForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const ideaList = document.getElementById('ideaList');
    const saveIdeaButton = newIdeaForm.querySelector('button[type="submit"]');

    // Modal elements
    const editModal = document.getElementById('editModal');
    const editIdeaForm = document.getElementById('editIdeaForm');
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionInput = document.getElementById('editDescription');
    const updateIdeaButton = document.getElementById('updateIdeaButton');
    const cancelEditModalButton = document.getElementById('cancelEditModalButton');
    const closeModalSpan = editModal.querySelector('.close-button');

    // Initialize SimpleMDE editors
    const simplemdeNew = new SimpleMDE({ element: descriptionInput });
    const simplemdeEdit = new SimpleMDE({ element: editDescriptionInput });

    let editingIdeaId = null;

    // Fetch username on load
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                usernameSpan.textContent = data.username;
            }
        })
        .catch(error => console.error('Error fetching user:', error));

    // Fetch existing ideas on load
    fetchIdeas();

    logoutButton.addEventListener('click', () => {
        fetch('/logout')
            .then(response => {
                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Failed to logout.');
                }
            })
            .catch(error => console.error('Logout error:', error));
    });

    newIdeaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = titleInput.value.trim();
        const description = simplemdeNew.value();

        if (title) {
            const response = await fetch('/api/ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                titleInput.value = '';
                simplemdeNew.value('');
                fetchIdeas(); // Reload the list
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to save idea.');
            }
        }
    });

    async function fetchIdeas() {
        const response = await fetch('/api/ideas');
        const data = await response.json();
        ideaList.innerHTML = '';
        data.forEach(idea => {
            const renderedDescription = marked.parse(idea.description || '');
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${idea.title}</strong>
                <div class="markdown-body">${renderedDescription}</div>
                <div class="actions">
                    <button class="edit-button" data-id="${idea._id}" data-title="${idea.title}" data-description="${idea.description}">Edit</button>
                    <button class="delete-button" data-id="${idea._id}">Delete</button>
                </div>
            `;
            ideaList.appendChild(listItem);
        });

        // Add event listeners to the new delete buttons
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const ideaId = event.target.dataset.id;
                if (confirm('Are you sure you want to delete this idea?')) {
                    const response = await fetch(`/api/ideas/${ideaId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        fetchIdeas(); // Reload the list after deletion
                    } else {
                        const data = await response.json();
                        alert(data.message || 'Failed to delete idea.');
                    }
                }
            });
        });

        // Add event listeners to the new edit buttons
        const editButtons = document.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const ideaId = event.target.dataset.id;
                const title = event.target.dataset.title;
                const description = event.target.dataset.description;

                editingIdeaId = ideaId;
                editTitleInput.value = title;
                simplemdeEdit.value(description);
                editModal.classList.add('active'); // Show the modal using class
            });
        });
    }

    // Event listener for the Update button in the modal
    editIdeaForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = editTitleInput.value.trim();
        const description = simplemdeEdit.value();

        if (title && editingIdeaId) {
            const response = await fetch(`/api/ideas/${editingIdeaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                fetchIdeas(); // Reload the list
                editModal.classList.remove('active'); // Hide the modal using class
                editingIdeaId = null; // Reset editing ID
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to update idea.');
            }
        }
    });

    // Event listeners to close the modal
    cancelEditModalButton.addEventListener('click', () => {
        editModal.classList.remove('active');
        editingIdeaId = null;
    });

    closeModalSpan.addEventListener('click', () => {
        editModal.classList.remove('active');
        editingIdeaId = null;
    });

    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.classList.remove('active');
            editingIdeaId = null;
        }
    });
});