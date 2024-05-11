document.addEventListener('DOMContentLoaded', () => {
    const notesArea = document.getElementById('notes-area');
    const form = document.getElementById('note-form');
    const starredNotes = document.getElementById('starred-notes');

    // Function to truncate text to a maximum length
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    // Function to create a note item
    function createNoteItem(note) {
        const noteItem = document.createElement('li');
        noteItem.classList.add('flex', 'gap-2', 'justify-between', 'items-center', 'p-4', 'bg-blue-300', 'rounded-md', 'list-none', 'mr-4');
        noteItem.style.width = '90%';
        noteItem.dataset.noteId = note.id; // Store note ID as dataset for reference

        // Create the span element for the note title
        const titleSpan = document.createElement('span');
        titleSpan.classList.add('w-full', 'text-base', 'text-black', 'font-semibold');
        titleSpan.textContent = truncateText(note.title, 30);

        // Create the edit image
        const editImg = createIcon('./images/edit.png', 'edit', note.id);

        // Create the star image
        const starImg = createIcon(note.starred ? './images/starred.png' : './images/star.png', 'star', note.id);

        // Create the delete image
        const deleteImg = createIcon('./images/delete.png', 'delete', note.id);

        // Append the elements to the note item
        noteItem.appendChild(titleSpan);
        noteItem.appendChild(editImg);
        noteItem.appendChild(starImg);
        noteItem.appendChild(deleteImg);

        return noteItem;
    }

    // Function to create an icon
    function createIcon(src, alt, noteId) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.classList.add('w-3', 'h-3', 'cursor-pointer', 'hover:opacity-80');
        img.addEventListener('click', (event) => {
            event.stopPropagation();
            if (alt === 'star') {
                const note = notes.find((note) => note.id === noteId);
                toggleStarred(img, note);
            } else if (alt === 'delete') {
                deleteNoteItem(noteId);
            } else if (alt === 'edit') {
                const note = notes.find((note) => note.id === noteId);
                editNoteItem(note);
            }
        });
        return img;
    }

    // Toggle starred status and change star button image source
    async function toggleStarred(starImg, note) {
        const isStarred = starImg.src.endsWith('starred.png');
        if (!isStarred && starredNotes.childElementCount >= 4) {
            alert('You can only star up to four notes.');
            return;
        }
        starImg.src = isStarred ? './images/star.png' : './images/starred.png';
        note.starred = !isStarred;
        await updateNoteStarredStatus(note.id, note.starred);
        refreshNotes();
    }

    // Update note starred status
    async function updateNoteStarredStatus(id, starred) {
        try {
            const res = await fetch(`http://localhost:8000/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ starred })
            });

            if (!res.ok) {
                throw new Error('Failed to update note starred status');
            }

        } catch (error) {
            console.error('Error updating note starred status:', error);
        }
    }

    // Delete a note item
    async function deleteNoteItem(id) {
        try {
            const res = await fetch(`http://localhost:8000/api/notes/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Failed to delete note');
            }

            refreshNotes();

        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    // Edit a note item
    function editNoteItem(note) {
        document.getElementById('titleinput').value = note.title;
        document.getElementById('textarea').value = note.content;
        document.getElementById('star-note').classList.toggle('starred', note.starred);
        document.getElementById('submit-button').textContent = 'Update';
        document.getElementById('submit-button').onclick = () => updateNoteHandler(note.id);
    }

    // Update a note
    async function updateNoteHandler(id) {
        const title = document.getElementById('titleinput').value;
        const content = document.getElementById('textarea').value;
        const starred = document.getElementById('star-note').classList.contains('starred');

        try {
            let res;
            if (id) {
                res = await fetch(`http://localhost:8000/api/notes/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, starred })
                });
            } else {
                res = await fetch('http://localhost:8000/api/notes/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, starred })
                });
            }

            if (!res.ok) {
                throw new Error('Failed to update/add note');
            }

            document.getElementById('titleinput').value = '';
            document.getElementById('textarea').value = '';
            document.getElementById('star-note').classList.remove('starred');
            document.getElementById('submit-button').textContent = 'Add Note';
            document.getElementById('submit-button').onclick = addNote;

            refreshNotes();

        } catch (error) {
            console.error('Error updating/adding note:', error);
        }
    }

    // Create a new Note
    async function addNote(e) {
        e.preventDefault();

        const title = document.getElementById('titleinput').value;
        const content = document.getElementById('textarea').value;
        const starred = document.getElementById('star-note').classList.contains('starred');

        try {
            const res = await fetch('http://localhost:8000/api/notes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, starred })
            });

            if (!res.ok) {
                throw new Error('Failed to add note');
            }

            document.getElementById('titleinput').value = '';
            document.getElementById('textarea').value = '';

            refreshNotes();

        } catch (error) {
            console.error('Error adding note:', error);
        }
    }

    // Call the refreshNotes function immediately to fetch and display notes
    refreshNotes();

    // Refresh notes
    async function refreshNotes() {
        try {
            const res = await fetch('http://localhost:8000/api/notes/');
            if (!res.ok) {
                throw new Error('Failed to fetch notes');
            }

            const notes = await res.json();
            notesArea.innerHTML = '';

            notes.forEach((note) => {
                const noteItem = createNoteItem(note);
                notesArea.appendChild(noteItem);
            });

            showStarredNotes();

        } catch (error) {
            console.log('Error fetching notes: ', error);
        }
    }

    // Show starred notes
    function showStarredNotes() {
        const starred = [];
        const notes = Array.from(notesArea.children);

        for (const note of notes) {
            const starImg = note.querySelector('img[alt="star"]');
            if (starImg && starImg.src.endsWith('starred.png')) {
                starred.push(note);
            }
        }

        starredNotes.innerHTML = '';
        for (let i = 0; i < Math.min(starred.length, 4); i++) {
            starredNotes.appendChild(starred[i].cloneNode(true));
        }

        // Add event listeners to starred notes
        const starredNoteItems = starredNotes.querySelectorAll('li');
        starredNoteItems.forEach((item) => {
            const starImg = item.querySelector('img[alt="star"]');
            const deleteImg = item.querySelector('img[alt="delete"]');
            const noteId = item.dataset.noteId;

            starImg.addEventListener('click', (event) => {
                event.stopPropagation();
                const note = notes.find((note) => note.id === parseInt(noteId));
                toggleStarred(starImg, note);
            });

            deleteImg.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteNoteItem(parseInt(noteId));
            });
        });
    }

    // Update Character Count
    function updateCharCount(textareaId, limitId, limit) {
        const textarea = document.getElementById(textareaId);
        const limitSpan = document.getElementById(limitId);
        const maxLength = limit;

        textarea.addEventListener('input', function() {
            const currentLength = textarea.value.length;
            limitSpan.textContent = currentLength;

            if (currentLength >= maxLength) {
                textarea.value = textarea.value.substring(0, maxLength);
                limitSpan.textContent = maxLength;
            }
        });
    }

    // Call updateCharCount for character counting
    updateCharCount('titleinput', 'hidden', 60);
    updateCharCount('textarea', 'textlimit', 3000);

    // Attach event listener for note form submission
    form.addEventListener('submit', addNote);

    // Attach event listener for note icon click to initiate adding a new note
    const noteIcon = document.getElementById('note-icon');
    noteIcon.addEventListener('click', () => {
        document.getElementById('titleinput').value = '';
        document.getElementById('textarea').value = '';
        document.getElementById('star-note').classList.remove('starred');
        document.getElementById('submit-button').textContent = 'Add Note';
        document.getElementById('submit-button').onclick = addNote;
    });
});
