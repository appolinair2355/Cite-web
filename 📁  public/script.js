const questions = [
  {
    id: 1,
    type: "radio",
    question: "Êtes-vous satisfait de notre service ?",
    options: ["Oui", "Non", "Peut-être"]
  },
  {
    id: 2,
    type: "text",
    question: "Quel est votre prénom ?",
    placeholder: "Prénom"
  },
  {
    id: 3,
    type: "textarea",
    question: "Des commentaires ?",
    placeholder: "Écrivez ici..."
  }
];

function generateQuiz() {
  const form = document.getElementById("quiz-form");
  questions.forEach(q => {
    const div = document.createElement("div");
    div.className = "question";
    let html = `<h3>${q.id}. ${q.question}</h3>`;

    if (q.type === "radio") {
      q.options.forEach(opt => {
        html += `<label><input type="radio" name="q${q.id}" value="${opt}"/> ${opt}</label>`;
      });
    } else if (q.type === "text") {
      html += `<input type="text" name="q${q.id}" placeholder="${q.placeholder}"/>`;
    } else if (q.type === "textarea") {
      html += `<textarea name="q${q.id}" placeholder="${q.placeholder}"></textarea>`;
    }

    div.innerHTML = html;
    form.appendChild(div);
  });
}

function submitQuiz() {
  const form = document.getElementById("quiz-form");
  const data = new FormData(form);
  const results = {};
  questions.forEach(q => {
    results[q.id] = data.get(`q${q.id}`) || "Pas de réponse";
  });

  document.getElementById("quiz-form").style.display = "none";
  document.querySelector("button").style.display = "none";
  document.getElementById("results").style.display = "block";

  let html = "";
  questions.forEach(q => {
    html += `<p><strong>${q.question}</strong><br/>${results[q.id]}</p>`;
  });
  document.getElementById("results-content").innerHTML = html;
}

function restartQuiz() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", generateQuiz);
                    
