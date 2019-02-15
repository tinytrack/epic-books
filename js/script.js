ready(function(){

  // В этом месте должен быть написан ваш код

    let burgerBtn = document.querySelector('.burger');
    let burgerWrapper = document.querySelector('.main-nav');
    burgerBtn.addEventListener('click', function () {
        burgerWrapper.classList.toggle('main-nav--open');
    }); 

    let filterBtn = document.querySelector('#filters-trigger');
    let filterWrapper = document.querySelector('.filters');
    filterBtn.addEventListener('click', function () {
        filterWrapper.classList.toggle('filters--open');
    });

    const cardTemplate = document.querySelector('#card__item');
    const newCardFragment = document.createDocumentFragment();
    for (i = 0; i < 10; i++) {
        const newCard = cardTemplate.content.cloneNode(true);
        newCard.firstElementChild.firstElementChild.href = `index.html#${books[i].uri}`;
        newCard.firstElementChild.firstElementChild.children[0].src = `img/books/${books[i].uri}.jpg`;
        newCard.firstElementChild.firstElementChild.children[0].alt = `${books[i].name}`;
        newCard.firstElementChild.firstElementChild.children[1].textContent = `${books[i].name}`;
        newCard.firstElementChild.firstElementChild.children[3].textContent = `${books[i].price} ₽`;
        newCardFragment.appendChild(newCard);
    }

    document.querySelector('.catalog__books-list').appendChild(newCardFragment);



  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  new Choices('.field-select:not(#lang) select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
  });
  // Кастомный селект выбора языка отдельно
  new Choices('#lang select.field-select__select', {
    searchEnabled: false,
    shouldSort: false,
    callbackOnCreateTemplates: function (template) {
      return {
        item: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
              ${getLangInSelectIcon(data.value)} ${data.label.substr(0,3)}
            </div>
          `);
        },
        choice: (classNames, data) => {
          return template(`
            <div class="${classNames.item} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId > 0 ? 'role="treeitem"' : 'role="option"'}>
              ${getLangInSelectIcon(data.value)} ${data.label}
            </div>
          `);
        },
      };
    }
  });
  function getLangInSelectIcon(value) {
    if (value == 'ru') return '<span class="field-select__lang-ru"></span>';
    else if (value == 'en') return '<span class="field-select__lang-en"></span>';
    return '<span class="field-select__lang-null"></span>';
  }

  // Выбор диапазона цен
  var slider = document.getElementById('price-range');
  noUiSlider.create(slider, {
    start: [400, 1000],
    connect: true,
    step: 100,
    range: {
      'min': 200,
      'max': 2000
    }
  });

});

function ready (fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
