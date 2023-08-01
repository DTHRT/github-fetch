import { createElement } from './modules/createElement.js';
import { debounce } from './modules/debounce.js';

const input = document.querySelector('.input-container__input');

input.addEventListener('input', async () => {
  removeAutocompleteContainer();
  if (!input.value) return;

  try {
    const repos = await getRepos(input.value);
    if (repos) renderAutocompleteContainer(repos);
  } catch (e) {
    console.error(e);
  }
});

let mostRelevantRepos = [];

async function getRepos(name) {
  name = name.trim();
  if (name.length === 0) return;
  mostRelevantRepos = [];

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${name}`
    );

    if (!response.ok) {
      throw new Error('Не удалось получить данные');
    }

    const jsonData = await response.json();

    if (jsonData.total_count === 0) return;

    for (let i = 0; i < 5; i++) {
      if (!jsonData.items[i]) break;
      mostRelevantRepos.push(jsonData.items[i]);
    }
  } catch (e) {
    console.error(e);
  }
  return mostRelevantRepos;
}

getRepos = debounce(getRepos, 500);

function renderAutocompleteContainer(repos) {
  const place = document.querySelector('.input-container');

  const itemsArr = repos.map((repo) => {
    return `<li class="autocomplete-container__item">
        <button class="autocomplete-container__item-btn" data-id="${repo.id}">${repo.name}</button>
      </li>`;
  });

  const autocompleteContainer = `<ul class="autocomplete-container">
                                  ${itemsArr.join('')}
                                </ul>`;

  place.append(createElement(autocompleteContainer));
}

function removeAutocompleteContainer() {
  const container = document.querySelector('.autocomplete-container');
  if (container) container.remove();
}

const inputContainer = document.querySelector('.input-container');

inputContainer.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    resetForm();
    mostRelevantRepos.forEach((element) => {
      if (element.id === Number(e.target.dataset.id)) {
        renderRepsItem(element);
      }
    });
  }
});

const repsContainer = document.querySelector('.reps-container');

function renderRepsItem(repo) {
  const template = `  
    <li class="reps-container__item">
      <ul class="reps-inner">
        <button class="reps-inner__close"></button>
        <li class="reps-inner__item">Name: ${repo.name}</li>
        <li class="reps-inner__item">Owner: ${repo.owner.login}</li>
        <li class="reps-inner__item">Stars: ${repo.stargazers_count}</li>
      </ul>
    </li>
  `;

  repsContainer.append(createElement(template));
}

repsContainer.addEventListener('click', (e) => {
  if (e.target.className === 'reps-inner__close') {
    e.target.closest('.reps-container__item').remove();
  }
});

function resetForm() {
  input.value = '';
  removeAutocompleteContainer();
}
