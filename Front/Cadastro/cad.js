// Seleção dos elementos necessários
const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const confirmBtn = document.querySelector(".confirm");
const progressText = document.querySelectorAll(".step p");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
let current = 1;

// Função para validar campos
function validateFields(fields) {
  let allValid = true;
  fields.forEach(field => {
    // Verifica se o campo está vazio, se o email é válido e se o CPF tem o tamanho correto
    if (field.value.trim() === '' || (field.type === 'email' && !validateEmail(field.value)) || (field.id === 'cpf' && !validateCPF(field.value))) {
      field.classList.add('shake'); // Adiciona animação de tremer
      allValid = false;
      setTimeout(() => field.classList.remove('shake'), 500); // Remove animação após 0.5s
    }
  });
  return allValid;
}

// Função para validar email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Função para validar CPF (tamanho)
function validateCPF(cpf) {
  return cpf.length === 14;
}

// Função para aplicar máscara no CPF
function applyCpfMask(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Adiciona ponto após os primeiros 3 dígitos
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Adiciona ponto após os próximos 3 dígitos
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona hífen antes dos últimos 2 dígitos
  return cpf;
}

// Adiciona máscara ao campo CPF enquanto o usuário digita
document.getElementById("cpf").addEventListener("input", function() {
  this.value = applyCpfMask(this.value);
});

// Função para avançar para a próxima página
function nextStep(event, fields, marginLeft) {
  event.preventDefault();
  if (validateFields(fields)) {
    slidePage.style.marginLeft = marginLeft; // Move para a próxima página
    bullet[current - 1].classList.add("active"); // Atualiza o passo na barra de progresso
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1; // Incrementa o passo atual
  }
}

// Event Listener para o primeiro botão "Próximo"
nextBtnFirst.addEventListener("click", function(event) {
  const fields = document.querySelectorAll(".page:nth-of-type(1) input");
  nextStep(event, fields, "-25%");
});

// Event Listener para o segundo botão "Próximo"
nextBtnSec.addEventListener("click", function(event) {
  const fields = document.querySelectorAll(".page:nth-of-type(2) input");
  nextStep(event, fields, "-50%");
});

// Event Listener para o terceiro botão "Próximo"
nextBtnThird.addEventListener("click", function(event) {
  const fields = document.querySelectorAll(".page:nth-of-type(3) input, .page:nth-of-type(3) select");
  nextStep(event, fields, "-75%");
});

// Event Listener para o botão "Criar a conta"
submitBtn.addEventListener("click", function(event) {
  const fields = document.querySelectorAll(".page:nth-of-type(4) input");
  nextStep(event, fields, "-100%");
});

// Event Listener para o botão "Confirmar"
confirmBtn.addEventListener("click", function() {
  window.location.href = "/TCHAUN/Front/Home-Login/index.html"; // Redireciona para a nova página
});

// Função para voltar para a página anterior
function prevStep(event, marginLeft) {
  event.preventDefault();
  slidePage.style.marginLeft = marginLeft; // Move para a página anterior
  bullet[current - 2].classList.remove("active"); // Atualiza o passo na barra de progresso
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1; // Decrementa o passo atual
}

// Event Listener para o botão "Voltar" da segunda página
prevBtnSec.addEventListener("click", function(event) {
  prevStep(event, "0%");
});

// Event Listener para o botão "Voltar" da terceira página
prevBtnThird.addEventListener("click", function(event) {
  prevStep(event, "-25%");
});

// Event Listener para o botão "Voltar" da quarta página
prevBtnFourth.addEventListener("click", function(event) {
  prevStep(event, "-50%");
});