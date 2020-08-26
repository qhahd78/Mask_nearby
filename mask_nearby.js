let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(37.5172, 127.0473), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
};

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
let ps = new kakao.maps.services.Places();

let search_btn = document.querySelector(".search-btn");
let search_bar = document.querySelector("#search-bar");

search_btn.addEventListener("click", () => {
    let keyword = search_bar.value;
    if(keyword) {
        console.log(keyword + "검색하셨습니다.");
        keywordSearch(keyword);
    } else {
        alert("검색어를 입력해주세요.");
    }
});

search_bar.addEventListener("keyup", () => { 
    // key code 13 = 엔터
    let keyword = search_bar.value;
    if(event.keyCode === 13) {
        search_btn.click();
    }
});

//키워드 입력 
function keywordSearch(keyword){
    ps.keywordSearch(keyword, keywordSearchCallback);
}

function keywordSearchCallback (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        const center = new kakao.maps.LatLng(data[0].y, data[0].x);
        map.setCenter(center); 
        getMaskDataAndDrawMarker(data[0].y, data[0].x); 
    }
}