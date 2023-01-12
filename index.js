document.querySelector('#add-task-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.querySelector('#task-title').value;
  const description = document.querySelector('#task-description').value;

  const task = document.createElement('li');
    task.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    task.classList.add('task');
  task.addEventListener('click', (event) => {
      event.currentTarget.classList.toggle('selected');
  });

  const todoList = document.querySelector('#todo-task');
  todoList.appendChild(task);

  const data = {
      title,
      description,
      isInProgress: false,
      completed: false
  };

  const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });
  const taskData = await response.json();
  task.setAttribute('data-id', taskData.id);
  event.target.reset();
});

document.querySelector('#move-in-progress').addEventListener('click', async () => {
  const selectedTask = document.querySelector('#todo-task .task.selected');
  if (!selectedTask) return;
    selectedTask.classList.remove("selected")
    selectedTask.classList.add("in-progress")
    selectedTask.setAttribute("data-isInProgress", true)
    selectedTask.setAttribute("data-completed", false)
  const inProgressList = document.querySelector('#in-progress-task');
    inProgressList.appendChild(selectedTask);
  const taskId = selectedTask.getAttribute('data-id');
  const data = {
      title: selectedTask.querySelector("h1").textContent,
      description: selectedTask.querySelector("p").textContent,
      isInProgress: true,
      completed: false,
      id: taskId
  };
  await fetch(`http://localhost:3000/tasks/` + taskId, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });
});

document.querySelector('#move-to-done').addEventListener('click', async () => {
  const selectedTask = document.querySelector('#in-progress-task .in-progress.selected');
  if (!selectedTask) return;
    selectedTask.classList.remove("selected")
    selectedTask.classList.remove("in-progress")
    selectedTask.classList.add("done")
    selectedTask.setAttribute("data-isInProgress", false)
    selectedTask.setAttribute("data-completed", true)
  const doneList = document.querySelector('#done-task');
    doneList.appendChild(selectedTask);
  const taskId = selectedTask.getAttribute('data-id');
  const data = {
      title: selectedTask.querySelector("h1").textContent,
      description: selectedTask.querySelector("p").textContent,
      isInProgress: false,
      completed: true,
      id: taskId
  };
  await fetch(`http://localhost:3000/tasks/` + taskId, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });
});

fetch('http://localhost:3000/tasks')
  .then(response => response.json())
  .then(data => data.forEach(task => {
      const {
          id,
          title,
          description,
          isInProgress,
          completed
      } = task;

      const h1 = document.createElement('h1');
      const p = document.createElement('p');

      h1.innerHTML = title;
      p.innerHTML = description;

      const li = document.createElement('li');
        li.appendChild(h1);
        li.appendChild(p);
      li.addEventListener('click', () => {
          li.classList.toggle('selected')
      });

        li.setAttribute("data-id", id)
        li.setAttribute("data-isInProgress", isInProgress)
        li.setAttribute("data-completed", completed)

      if (isInProgress) {
          li.classList.add("in-progress")
          document.querySelector('#in-progress-task').appendChild(li)
      } else if (completed) {
          li.classList.add("done")
          document.querySelector('#done-task').appendChild(li)
      } else {
          li.classList.add("task")
          document.querySelector('#todo-task').appendChild(li)
      }
  }));