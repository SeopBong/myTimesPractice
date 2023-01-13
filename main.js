let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu)=> menu.addEventListener("click",(e)=>getNewsByTopic(e)));
let searchButton = document.getElementById("search-button"); 
let url;    // 기존에 지역변수로 선언된 url을 수정하여 전역변수로 선언하여 지역변수들 안에 데이터를 받아 사용하도록 한다.

const getNews = async()=>{      //try-catch-throw-error 로 에러헨들링 진행
    try{
        let header = new Headers({
            "x-api-key": "cLPujLcv5bDuhDkxAY1pq4qEaG7zUADm0gDBl9fSRzQ",
        });
        url.searchParams.set('page',page);  // &page= 를 추가한다는 코드
        console.log("url은??",url);
        let response = await fetch  (url, { headers: header });
        let data = await response.json();

        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("검색 된 뉴스가 없습니다.");
            }
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            render();
            pageNation();
    } else {
        throw new Error(data.message);
    }
    } catch(error) { 
        console.log("Error는 이것입니다 ",error.message);
        errorRender(error.message);
    }

};

//최근 뉴스 업로드
const getLatestNews = async () =>  {    
    url = new URL(
        'https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=5'
    );
    getNews();
}; 
// 해당 선택된 토픽의 주제의 뉴스를 업로드
const getNewsByTopic = async(e) => { //addeventlistener에서 실행되는 모든 이벤트를 받아온다
    let topic = e.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=5`);
    getNews();
}
// 키워드를 입력하여 입력된 주제만 서치한다. 
const getNewsByKeyword = async() => {
    let keyword = document.getElementById("search-input").value;
    console.log("키워드",keyword);
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=CA&page_size=5`);
    getNews();
};


const render = () => {
    let newsHTML = [];
    newsHTML = news && news.map((item) => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
            ${item.summary}
            </p>
            <div>
            ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`;
    }).join('');    //array to string ',' deleted after

    document.getElementById("news-board").innerHTML = newsHTML;
};
const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`; //부트스트랩에 내용기입 진행
    document.getElementById("news-board").innerHTML = errorHTML;
}
const pageNation = () => {
    let pagenationHTML =``;
    //total_page
    //page
    //page group
    let pageGroup = Math.ceil(page/5);
    //last
    let last = pageGroup * 5;
    //first
    let first = last - 4;
    //first~last 페이지 프린트
    pagenationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true">&lt;</span>
    </a>
    </li>`;

    for(let i = first; i < last; i++) {
        pagenationHTML += ` <li class="page-item ${page==i?"active" : ""} "><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    };

    pagenationHTML +=`<li class="page-item">
    <a class="page-link" href="#" aria-label="Next"onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`;

    document.querySelector(".pagination").innerHTML = pagenationHTML;
}
const moveToPage = (pageNum) => {
    page = pageNum;
    getNews()
}

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();