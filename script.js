document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');

    // Load tasks from local storage
    loadTasks();

    // Add task on button click
    addTaskBtn.addEventListener('click', addTaskFromInput);

    // Add task on Enter key press
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTaskFromInput();
        }
    });

    function addTaskFromInput() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            saveTasks();
        }
    }

    function addTask(taskText, isCompleted = false, creationDate= new Date() ) {
        const li = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';

//const creationDate = new Date(
 // date.getFullYear(),
  //date.getMonth(),
  //date.getDate()
);
// Creates new Date object at midnight local time






        // Task text
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = taskText;

        // Task date
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = creationDate.toLocaleString(); // Removed "Created:"

        taskContent.appendChild(taskTextSpan);
        taskContent.appendChild(dateSpan);
        li.appendChild(taskContent);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            li.remove();
            saveTasks();
        });

        // Complete/Undo button
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = isCompleted ? 'Undo' : 'Done';
        completeBtn.addEventListener('click', function () {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                completeBtn.textContent = 'Undo';
                moveTask(li, false); // Move to completed list
            } else {
                completeBtn.textContent = 'Done';
                moveTask(li, true); // Move back to pending list
            }
            saveTasks();
        });

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        if (isCompleted) {
            completedList.appendChild(li);
            li.classList.add('completed');
        } else {
            pendingList.appendChild(li);
        }
    }

    function moveTask(li, isPending) {
        if (isPending) {
            pendingList.appendChild(li); // Move back to pending list
        } else {
            completedList.appendChild(li); // Move to completed list
        }
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#pendingList li, #completedList li').forEach(li => {
            const taskText = li.querySelector('.task-text').textContent;
            const creationDate = new Date(li.querySelector('.task-date').textContent);
            tasks.push({
                text: taskText,
                completed: li.classList.contains('completed'),
                creationDate: creationDate
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.completed, new Date(task.creationDate));
        });
    }
});