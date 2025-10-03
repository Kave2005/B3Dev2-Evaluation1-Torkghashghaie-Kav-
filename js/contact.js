const form = document.getElementById('contact-form');
const msg = document.getElementById('form-msg');

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let errors = [];

  if(!name) errors.push("Le nom est requis.");
  if(!email) errors.push("L'email est requis.");
  else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email invalide.");
  if(!message) errors.push("Le message est requis.");

  if(errors.length > 0) {
    msg.textContent = errors.join(' ');
    msg.style.color = 'red';
  } else {
    msg.textContent = "Message envoyé avec succès !";
    msg.style.color = 'green';
    form.reset();
  }
});
