const taskForm =
  document.getElementById('task-form');

const taskIdInput =
  document.getElementById('task-id');

const titleInput =
  document.getElementById('title');

const descriptionInput =
  document.getElementById('description');

const taskList =
  document.getElementById('task-list');

const taskCount =
  document.getElementById('task-count');

const filterSelect =
  document.getElementById('filter');

const message =
  document.getElementById('message');

const formTitle =
  document.getElementById('form-title');

const submitBtn =
  document.getElementById('submit-btn');

const cancelBtn =
  document.getElementById('cancel-btn');


// ========================================
// โหลดข้อมูลเมื่อเปิดเว็บ
// ========================================

document.addEventListener(
  'DOMContentLoaded',
  loadTasks
);


// เปลี่ยน filter
filterSelect.addEventListener(
  'change',
  loadTasks
);


// Submit form
taskForm.addEventListener(
  'submit',
  saveTask
);


// Cancel edit
cancelBtn.addEventListener(
  'click',
  resetForm
);


// ========================================
// GET /api/tasks
// ========================================

async function loadTasks() {

  try {

    const filter =
      filterSelect.value;


    let url = '/api/tasks';


    if (filter !== 'all') {

      url =
        `/api/tasks?done=${filter}`;

    }


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        'ไม่สามารถโหลดข้อมูลได้'
      );

    }


    const tasks =
      await response.json();


    renderTasks(tasks);


  } catch (error) {

    showMessage(
      error.message,
      'error'
    );

  }

}


// ========================================
// แสดงรายการ
// ========================================

function renderTasks(tasks) {

  taskList.innerHTML = '';


  taskCount.textContent =
    `${tasks.length} รายการ`;


  if (tasks.length === 0) {

    taskList.innerHTML = `

      <div class="empty">

        <h3>
          ไม่มีรายการ
        </h3>

        <p>
          ลองเพิ่มงานใหม่
        </p>

      </div>

    `;

    return;

  }


  tasks.forEach(task => {

    const article =
      document.createElement('article');


    article.className =
      `task-card ${
        task.done
          ? 'completed'
          : ''
      }`;


    article.innerHTML = `

      <div class="task-info">

        <button
          class="check-btn"
          title="เปลี่ยนสถานะ"
        >
          ${task.done ? '✓' : ''}
        </button>


        <div>

          <h3>
            ${escapeHTML(task.title)}
          </h3>

          <p>
            ${
              escapeHTML(
                task.description ||
                'ไม่มีรายละเอียด'
              )
            }
          </p>


          <span
            class="status ${
              task.done
                ? 'done'
                : 'pending'
            }"
          >
            ${
              task.done
                ? 'เสร็จแล้ว'
                : 'ยังไม่เสร็จ'
            }
          </span>

        </div>

      </div>


      <div class="actions">

        <button
          class="btn small edit-btn"
        >
          แก้ไข
        </button>

        <button
          class="btn small danger delete-btn"
        >
          ลบ
        </button>

      </div>

    `;


    // เปลี่ยนสถานะ
    article
      .querySelector('.check-btn')
      .addEventListener(
        'click',
        () => toggleTask(task)
      );


    // แก้ไข
    article
      .querySelector('.edit-btn')
      .addEventListener(
        'click',
        () => startEdit(task)
      );


    // ลบ
    article
      .querySelector('.delete-btn')
      .addEventListener(
        'click',
        () => deleteTask(task.id)
      );


    taskList.appendChild(article);

  });

}


// ========================================
// POST / PATCH
// ========================================

async function saveTask(event) {

  event.preventDefault();


  const title =
    titleInput.value.trim();

  const description =
    descriptionInput.value.trim();

  const id =
    taskIdInput.value;


  if (!title) {

    showMessage(
      'กรุณากรอกชื่องาน',
      'error'
    );

    return;

  }


  try {

    let response;


    // ====================================
    // PATCH
    // ====================================

    if (id) {

      response =
        await fetch(
          `/api/tasks/${id}`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              title,
              description
            })
          }
        );

    }


    // ====================================
    // POST
    // ====================================

    else {

      response =
        await fetch(
          '/api/tasks',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              title,
              description,
              done: false
            })
          }
        );

    }


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        'เกิดข้อผิดพลาด'
      );

    }


    showMessage(
      id
        ? 'แก้ไขงานสำเร็จ'
        : 'เพิ่มงานสำเร็จ',
      'success'
    );


    resetForm();


    await loadTasks();


  } catch (error) {

    showMessage(
      error.message,
      'error'
    );

  }

}


// ========================================
// PATCH เปลี่ยนสถานะ
// ========================================

async function toggleTask(task) {

  try {

    const response =
      await fetch(
        `/api/tasks/${task.id}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            done: !task.done
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        'ไม่สามารถเปลี่ยนสถานะได้'
      );

    }


    await loadTasks();


  } catch (error) {

    showMessage(
      error.message,
      'error'
    );

  }

}


// ========================================
// เริ่มแก้ไข
// ========================================

function startEdit(task) {

  taskIdInput.value =
    task.id;

  titleInput.value =
    task.title;

  descriptionInput.value =
    task.description || '';


  formTitle.textContent =
    'แก้ไขงาน';

  submitBtn.textContent =
    'บันทึกการแก้ไข';

  cancelBtn.classList.remove(
    'hidden'
  );


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  titleInput.focus();

}


// ========================================
// Reset Form
// ========================================

function resetForm() {

  taskForm.reset();

  taskIdInput.value = '';


  formTitle.textContent =
    'เพิ่มงานใหม่';

  submitBtn.textContent =
    '+ เพิ่มงาน';

  cancelBtn.classList.add(
    'hidden'
  );

}


// ========================================
// DELETE
// ========================================

async function deleteTask(id) {

  const confirmed =
    confirm(
      'ต้องการลบรายการนี้หรือไม่?'
    );


  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        `/api/tasks/${id}`,
        {
          method: 'DELETE'
        }
      );


    if (!response.ok) {

      const data =
        await response.json();

      throw new Error(
        data.error ||
        'ไม่สามารถลบรายการได้'
      );

    }


    showMessage(
      'ลบงานสำเร็จ',
      'success'
    );


    await loadTasks();


  } catch (error) {

    showMessage(
      error.message,
      'error'
    );

  }

}


// ========================================
// Message
// ========================================

function showMessage(
  text,
  type
) {

  message.textContent =
    text;

  message.className =
    `message ${type}`;


  clearTimeout(
    showMessage.timer
  );


  showMessage.timer =
    setTimeout(() => {

      message.className =
        'message hidden';

    }, 2500);

}


// ========================================
// ป้องกัน HTML Injection
// ========================================

function escapeHTML(value) {

  return String(value)

    .replaceAll('&', '&amp;')

    .replaceAll('<', '&lt;')

    .replaceAll('>', '&gt;')

    .replaceAll(
      '"',
      '&quot;'
    )

    .replaceAll(
      "'",
      '&#039;'
    );

}