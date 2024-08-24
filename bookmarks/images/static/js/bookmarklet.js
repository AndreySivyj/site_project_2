const siteUrl = '//10.170.190.228:8555/'; //базовый URL-адрес веб-сайта
const styleUrl = siteUrl + 'static/css/bookmarklet.css'; //базовый URL-адрес статических файлов
const minWidth = 250; // минимальная ширина изображений, которые букмарклет будет забирать с сайта, в пикселах
const minHeight = 250; // минимальная высота изображений, которые букмарклет будет забирать с сайта, в пикселах


// загружаем таблицу стилей CSS для букмарклета. Код генерирует объект, эквивалентный следующему ниже исходному коду:
//<link rel="stylesheet" type="text/css" href= "//127.0.0.1:8000/static/css/bookmarklet.css?r=1234567890123456">

var head = document.getElementsByTagName('head')[0];   //извлекается первый найденный элемент <head> сайта, потому что все HTML-документы должны иметь один элемент <head>
var link = document.createElement('link'); //создается элемент <link>
link.rel = 'stylesheet'; //Устанавливается атрибут rel элемента <link>
link.type = 'text/css'; //Устанавливается атрибут type элемента <link>
//задается URL-адрес таблицы стилей bookmarklet.css.
//В качестве параметра URL-адреса используется 16-значное случайное число, чтобы не дать браузеру загружать файл из кеша
link.href = styleUrl + '?r=' + Math.floor(Math.random()*9999999999999999); 
head.appendChild(link); //новый элемент <link> добавляется в элемент <head> HTML-страницы


// загрузить HTML
//извлекается элемент <body> DOM-модели и в него добавляется новый исходный код HTML, путем видоизменения его свойства innerHTML
var body = document.getElementsByTagName('body')[0];
boxHtml = `
  <div id="bookmarklet">
    <a href="#" id="close">&times;</a>
    <h1>Select an image to bookmark:</h1>
    <div class="images"></div>
  </div>`;
body.innerHTML += boxHtml;


function bookmarkletLaunch() {
    bookmarklet = document.getElementById('bookmarklet');
    var imagesFound = bookmarklet.querySelector('.images');
    // очистить найденные изображения
    imagesFound.innerHTML = '';
    // показать букмарклет
    bookmarklet.style.display = 'block';
    // событие закрытия
    bookmarklet.querySelector('#close')
                .addEventListener('click', function(){
                bookmarklet.style.display = 'none'
                });

    // найти изображения в DOM с минимальными размерами
    images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]'); //селекторы используются для отыскания всех элементов DOM <img>, атрибут src которых заканчивается соответственно на .jpg, .jpeg либо .png
    images.forEach(image => {  //Прокручиваем результаты в цикле методом forEach()
        if(image.naturalWidth >= minWidth
        && image.naturalHeight >= minHeight)
        {
        var imageFound = document.createElement('img');  //для каждого найденного изображения создается новый элемент <img>
        imageFound.src = image.src;
        imagesFound.append(imageFound);  //добавляется в контейнер imagesFound
        }
    })

    // событие выбора изображения
    imagesFound.querySelectorAll('img').forEach(image => {
        image.addEventListener('click', function(event){
            imageSelected = event.target;
            bookmarklet.style.display = 'none';
            window.open(siteUrl + 'images/create/?url='
                + encodeURIComponent(imageSelected.src)
                + '&title='
                + encodeURIComponent(document.title),
                '_blank');
        })
    })
}
// запустить букмарклет
bookmarkletLaunch();



//браузер не разрешит запускать букмарклет по HTTP на сайте, раздаваемом по HTTPS, поэтому
//продолжаем использовать RunServerPlus с применением автоматически сгенерированного сертификата TLS/SSL

// В производственной среде потребуется валидный сертификат TLS/SSL.
// Владея доменным именем, можно обратиться в доверяемый центр сертификации (CA) с просьбой выпустить для него сертификат TLS/SSL, 
// чтобы браузеры могли верифицировать его подлинность.
// Let’s Encrypt – это некоммерческий центр сертификации, который бесплатно упрощает получение и обновление доверяемых
// сертификатов TLS/SSL. Более подробная информация по нему находится на странице https://letsencrypt.org.


