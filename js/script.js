ready(function () {

    // В этом месте должен быть написан ваш код

    let burgerBtn = document.querySelector('.burger');
    let mainNav = document.querySelector('#nav');
    burgerBtn.addEventListener('click', function () {
        mainNav.classList.toggle('main-nav--open');
    });

    let filterBtn = document.querySelector('#filters-trigger');
    let filtersWrapper = document.querySelector('#filters');
    filterBtn.addEventListener('click', function () {
        filtersWrapper.classList.toggle('filters--open');
    });

    const cardTemplate = document.querySelector('#card__item');
    const newCardFragment = document.createDocumentFragment();
    for (i = 0; i < 10; i++) {
        const newCard = cardTemplate.content.cloneNode(true);
        newCard.querySelector('.card__inner').href = `index.html#${books[i].uri}`;
        newCard.querySelector('.card__img').src = `img/books/${books[i].uri}.jpg`;
        newCard.querySelector('.card__img').alt = `${books[i].name}`;
        newCard.querySelector('.card__title').textContent = `${books[i].name}`;
        newCard.querySelector('.card__price').textContent = `${books[i].price} ₽`;
        newCardFragment.appendChild(newCard);
    }

    document.querySelector('.catalog__books-list').appendChild(newCardFragment);


    initPopup = (function () {
        let isPopupShown = false;
        let htmlTag = document.querySelector('.page');
        let popupContainer = document.querySelector('#modal-book-view');
        let hidePopupBtn = document.querySelector('.modal__close');
        let catalogInner = document.querySelector('.catalog__inner')

        catalogInner.addEventListener('click', function (event) {
            let target = event.target;
            while (target !== this) {
                if (target.className == 'card__inner') {
                    renderContent(target.href);
                    showPopup(popupContainer)
                    return;
                }
                target = (target.parentNode);
            }
        });

        popupContainer.addEventListener('click', function (e) {
            if (e.target !== popupContainer) {
                return;
            }

            hidePopup(popupContainer);
        });

        hidePopupBtn.addEventListener('click', function () {
            hidePopup(popupContainer);
        });

        function showPopup(elem) {
            if (isPopupShown !== true) {
                elem.classList.add('modal--open');
                htmlTag.classList.add('js-modal-open');
                popupShown = true;
            }
        }

        function hidePopup(e) {
            e.className = e.className.replace('modal--open', '');
            htmlTag.classList.remove('js-modal-open');
            popupShown = false;
            document.querySelector('.product').remove();
        }

        const popupTemplate = document.querySelector('#popup-template');
        const newPopupFragment = document.createDocumentFragment();

        function renderContent(itemLink) {
            let popupUrl = itemLink.split('#')[1];

            function findInArr(array, value) {
                for (let i = 0; i < array.length; i++) {
                    if (array[i].uri === value) {
                        return i;
                    }
                }
                return 'не найдено';
            }

            let indexOfCard = findInArr(books, popupUrl);

            function getFromArr(arr, i) {
                const newPopup = popupTemplate.content.cloneNode(true);
                newPopup.querySelector('.product__title').textContent = `${arr[i].name}`;
                newPopup.querySelector('.product__table-info').getElementsByTagName('a')[0].textContent = `${arr[i].author}`;
                newPopup.querySelector('.product__img').src = `img/books/${arr[i].uri}.jpg`;
                newPopup.querySelector('.product__img').alt = `${arr[i].name}`;
                newPopup.querySelector('.product__descr').getElementsByTagName('p')[0].textContent = `${arr[i].desc}`;
                newPopup.querySelector('.btn--price').innerHTML =
                    `${arr[i].price} ₽
                    <span class="btn__sm-text">
                    <svg class="btn__icon" width="14" height="14">
                    <use xlink:href="#plus"></use>
                    </svg>
                    <span>В корзину</span>
                    </span>`;
                newPopupFragment.appendChild(newPopup);
            }

            getFromArr(books, indexOfCard)

            document.querySelector('.modal__content').appendChild(newPopupFragment);
        }
    }());


    initFilter = (function () {
        let searchBtn = document.querySelector('#books-show-btn');
        let formFilters = document.querySelector('#filters-form');

        function handle(event) {
            let searchResult = [];
            let inputNameVal = document.querySelector('[name=book-name]').value;
            let inputAuthorVal = document.querySelector('[name=author]').value;
            let inputPublishVal = document.querySelector('[name=publisher]').value;
            let selectYearFromVal = document.querySelector('[name=year-from]').getElementsByTagName('option')[0].value;
            let selectYearToVal = document.querySelector('[name=year-to]').getElementsByTagName('option')[0].value;
            let selectCoverVal = document.querySelector('[name=binding]').getElementsByTagName('option')[0].value;
            let selectLangVal = document.querySelector('[name=language]').getElementsByTagName('option')[0].value;
            let inputPriceFromVal = document.querySelector('#price-from').value;
            let inputPriceToVal = document.querySelector('#price-to').value;

            if (event.target.dataset.bind === 'filter-element') {
                books.forEach(function (book) {
                    //проверка на имя
                    if (inputNameVal !== "") {
                        let re = new RegExp(inputNameVal, 'gi');
                        if (re.test(book.name) == false) {
                            return;
                        };
                    }
                    //проверка на автора
                    if (inputAuthorVal !== "") {
                        let re = new RegExp(inputAuthorVal, 'gi');
                        if (re.test(book.author) == false) {
                            return;
                        };
                    }
                    //проверка на издателя
                    if (inputPublishVal !== "") {
                        let re = new RegExp(inputPublishVal, 'gi');
                        if (re.test(book.publishing) == false) {
                            return;
                        };
                    }
                    //проверка на дату публикации
                    if (((book.year >= selectYearFromVal) && (book.year <= selectYearToVal)) === false) {
                        return;
                    }
                    //проверка на обложку
                    if (selectCoverVal !== book.cover) {
                        return;
                    }
                    //проверка на язык
                    if (selectLangVal !== book.lang) {
                        return;
                    }
                    //проверка по цене
                    if ((inputPriceFromVal !== "") && (inputPriceToVal !== "")) {
                        if (((book.price >= inputPriceFromVal) && (book.price <= inputPriceToVal)) === false) {
                            return;
                        }
                    }
                    searchResult.push(book);
                });

                document.querySelector('#books-num').textContent = searchResult.length;
                if (searchResult.length !== 0) {
                    document.querySelector('#books-show-btn').disabled = false;
                } else {
                    document.querySelector('#books-show-btn').disabled = true;
                }
            }
            submitBtn(searchResult);
        }

        function submitBtn(filteredArray) {
            searchBtn.addEventListener('click', function (e) {
                e.preventDefault();
                renderCards(filteredArray)
            });
        }

        formFilters.addEventListener('change', handle);
        formFilters.addEventListener('input', handle);
    }());

    function renderCards(arr) {
        let myNode = document.querySelector(".catalog__books-list");
        myNode.innerHTML = '';
        for (i = 0; i < arr.length; i++) {
            const newCard = cardTemplate.content.cloneNode(true);
            newCard.querySelector('.card__inner').href = `index.html#${arr[i].uri}`;
            newCard.querySelector('.card__img').src = `img/books/${arr[i].uri}.jpg`;
            newCard.querySelector('.card__img').alt = `${arr[i].name}`;
            newCard.querySelector('.card__title').textContent = `${arr[i].name}`;
            newCard.querySelector('.card__price').textContent = `${arr[i].price} ₽`;
            newCardFragment.appendChild(newCard);
        }

        document.querySelector('.catalog__books-list').appendChild(newCardFragment);
    };

    initHeaderFilter = (function () {
        headerFilterItems = document.querySelectorAll('.tabs__item-link');
        for (i = 0; i < headerFilterItems.length; i++) {
            headerFilterItems[i].addEventListener('click', function (event) {
                document.querySelector('#filters-form').reset();
                let headerFilterArr = [];
                event.preventDefault();
                books.forEach(function (book) {
                    if (book.type !== event.target.dataset.type) {
                        return;
                    }
                    headerFilterArr.push(book);
                });
                renderCards(headerFilterArr)
            });
        }
    }());


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
              ${getLangInSelectIcon(data.value)} ${data.label.substr(0, 3)}
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

    let inputPriceFromVal = document.querySelector('#price-from');
    let inputPriceToVal = document.querySelector('#price-to');
    slider.noUiSlider.on('update', function (values, handle) {
        var value = values[handle];
        if (handle) {
            inputPriceToVal.value = value;
        } else {
            inputPriceFromVal.value = value;
        }
    });

    inputPriceFromVal.addEventListener('change', function () {
        slider.noUiSlider.set([this.value, null]);
    });
    inputPriceToVal.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });

});

function ready(fn) {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
