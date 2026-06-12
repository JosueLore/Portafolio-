/**
 * app.js
 * Lógica para manejar la navegación, estado de los módulos y evaluación de quizzes.
 */

document.addEventListener('DOMContentLoaded', () => {
  const views = document.querySelectorAll('.view-section');
  const navBtns = document.querySelectorAll('[data-target]');
  
  // Historial de navegación para botones Atrás/Adelante
  let historyStack = ['view-home'];
  let historyIndex = 0;

  function updateHistoryButtons() {
    const btnBack = document.getElementById('btn-back');
    const btnForward = document.getElementById('btn-forward');
    
    if (btnBack) {
      if (historyIndex <= 0) {
        btnBack.classList.add('locked-link');
      } else {
        btnBack.classList.remove('locked-link');
      }
    }
    
    if (btnForward) {
      if (historyIndex >= historyStack.length - 1) {
        btnForward.classList.add('locked-link');
      } else {
        btnForward.classList.remove('locked-link');
      }
    }
  }

  // Función para cambiar de vista principal
  function switchView(targetId, isHistoryAction = false) {
    if (!isHistoryAction) {
      // Si el usuario navega normalmente y estábamos a la mitad del historial,
      // cortamos el historial futuro.
      historyStack = historyStack.slice(0, historyIndex + 1);
      // Evitar agregar al historial la misma vista consecutivamente
      if (historyStack[historyStack.length - 1] !== targetId) {
        historyStack.push(targetId);
        historyIndex++;
      }
    }

    views.forEach(view => {
      view.classList.remove('active');
      view.classList.add('hidden');
    });

    const targetView = document.getElementById(targetId);
    if (targetView) {
      targetView.classList.remove('hidden');
      targetView.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateHistoryButtons();
  }

  // Asignar eventos de botones Atrás/Adelante
  const btnBack = document.getElementById('btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (historyIndex > 0) {
        historyIndex--;
        switchView(historyStack[historyIndex], true);
      }
    });
  }

  const btnForward = document.getElementById('btn-forward');
  if (btnForward) {
    btnForward.addEventListener('click', () => {
      if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        switchView(historyStack[historyIndex], true);
      }
    });
  }

  // Inicializar estado de botones
  updateHistoryButtons();

  // Asignar eventos de navegación estándar
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      
      // Si está bloqueado, no navegar
      if (e.currentTarget.classList.contains('locked-link')) return;

      if (targetId) {
        switchView(targetId);
      }
    });
  });

  // Funcionalidad de Quizzes
  const quizzes = document.querySelectorAll('.quiz-form');
  
  quizzes.forEach(quiz => {
    quiz.addEventListener('submit', (e) => {
      e.preventDefault();
      const quizId = quiz.getAttribute('data-quiz');
      const fieldsets = quiz.querySelectorAll('.quiz-question');
      const errorMsg = quiz.querySelector('.quiz-error-msg');
      let allCorrect = true;

      // Validar cada pregunta
      fieldsets.forEach(fieldset => {
        const selected = fieldset.querySelector('input[type="radio"]:checked');
        const correct = fieldset.querySelector('input[type="radio"][data-correct="true"]');
        
        // Resetear estilos visuales previos
        fieldset.querySelectorAll('.radio-option').forEach(opt => {
          opt.style.borderColor = 'var(--border-color)';
          opt.style.backgroundColor = 'var(--bg-white)';
        });

        if (!selected || selected.value !== correct.value) {
          allCorrect = false;
          if (selected) {
            selected.parentElement.style.borderColor = 'red';
            selected.parentElement.style.backgroundColor = '#ffeeee';
          }
        } else {
          selected.parentElement.style.borderColor = 'var(--success-green)';
          selected.parentElement.style.backgroundColor = '#e6f4ea';
        }
      });

      if (allCorrect) {
        errorMsg.classList.add('hidden');
        unlockNext(quizId);
      } else {
        errorMsg.classList.remove('hidden');
      }
    });
  });

  // Lógica para desbloquear el siguiente módulo
  function unlockNext(passedQuizId) {
    if (passedQuizId === '1') {
      // Desbloquear Módulo 2
      document.getElementById('card-mod-2').classList.remove('locked');
      document.getElementById('card-mod-2').classList.add('available');
      document.getElementById('badge-mod-2').textContent = 'Disponible';
      document.getElementById('badge-mod-2').classList.replace('locked', 'available');
      document.getElementById('msg-mod-2').classList.add('hidden');
      document.getElementById('btn-mod-2').classList.remove('hidden');
      
      // Actualizar progress bar del modulo 1 a 100%
      document.querySelector('#card-mod-1 .progress-bar').style.width = '100%';
      
      // Habilitar enlace en sidebar
      document.getElementById('side-mod-2').classList.remove('locked-link');
      
      alert("¡Excelente! Has aprobado el Quiz 1. El Módulo 2 se ha desbloqueado.");
      switchView('view-home');
      
    } else if (passedQuizId === '2') {
      // Desbloquear Módulo 3
      document.getElementById('card-mod-3').classList.remove('locked');
      document.getElementById('card-mod-3').classList.add('available');
      document.getElementById('badge-mod-3').textContent = 'Disponible';
      document.getElementById('badge-mod-3').classList.replace('locked', 'available');
      document.getElementById('msg-mod-3').classList.add('hidden');
      document.getElementById('btn-mod-3').classList.remove('hidden');
      
      document.querySelector('#card-mod-2 .progress-bar').style.width = '100%';
      
      document.getElementById('side-mod-3').classList.remove('locked-link');
      document.getElementById('side-mod-3-b').classList.remove('locked-link');
      
      alert("¡Excelente! Has aprobado el Quiz 2. El Módulo 3 se ha desbloqueado.");
      switchView('view-home');
      
    } else if (passedQuizId === '3') {
      document.querySelector('#card-mod-3 .progress-bar').style.width = '100%';
      // Ir a la pantalla final
      switchView('view-final');
    }
  }
});
