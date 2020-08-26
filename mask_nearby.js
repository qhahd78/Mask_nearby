var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(37.5172, 127.0473), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
var ps = new kakao.maps.services.Places();

map.setMaxLevel(5);

// 마스크 데이터 API 주소 
let base_mask_url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?";

// 맵이 만들어졌을 때도 마스크 데이터 불러오기 
let mapCenter = map.getCenter();
getMaskDataAndDrawMarker(mapCenter.Ha, mapCenter.Ga);

let search_btn = document.querySelector(".search-btn");
let search_bar = document.querySelector("#search-bar");
console.log(search_bar); 
console.log(search_btn);

search_btn.addEventListener("click", () => {
    let keyword = search_bar.value;
    if(keyword) {
        console.log(keyword + "검색하셨습니다.");
        keywordSearch(keyword);
    } else {
        alert("검색어를 입력해주세요.");
    }
})

search_bar.addEventListener("keyup", () => { 
    // key code 13 = 엔터
    if(event.keyCode === 13) {
        search_btn.click();
    }
})

function keywordSearch(keyword){
    ps.keywordSearch(keyword, keywordSearchCallback);
}

async function keywordSearchCallback (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        const center = new kakao.maps.LatLng(data[0].y, data[0].x);
        map.setCenter(center); 
        getMaskDataAndDrawMarker(data[0].y, data[0].x); 
    }
}

async function getMaskDataAndDrawMarker(lat, lng){
    const maskData = await getMaskData(lat, lng);

    //마커 그리는 부분 
    for(const data of maskData) {
        drawMarker(data);
    }
}

async function getMaskData(lat, lng) {
    let request_url = `${base_mask_url}lat=${lat}&lng=${lng}`;
    let response = await fetch(request_url) ;
    let result = await response.json();
    console.log(result.stores);
    return result.stores;
}

// 지도에 마커를 표시하는 함수입니다
function drawMarker(maskData) {
    const image = {
        green: "./green.png",
        yellow: "./green.png",
        red: "./green.png",
        grey: "./green.png",
    }
    
    const imageSize = new kakao.maps.Size(32, 32);
    const imageOption = { offset : new kakao.maps.Point(15, 20)};

    let imageSrc;
    if(maskData.remain_stat === 'plenty'){
        imageSrc = image.green;

    }else if (maskData.remain_stat === 'some'){
        imageSrc = image.yellow;

    }else if (maskData.remain_stat === 'few'){
        imageSrc = image.red;    
    }else {
        imageSrc = image.grey;

    }
        

    const markerImage = new kakao.maps.MakerImage(imageSrc, imageSize, imageOption);
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(maskData.lat, maskData.lng),
        image: markerImage,
        clickable: true,
    });

    let infoHTML = `<div class="info-window"><h3>${maskData.name}</h3><a href="https://map.kakao.com/link/to/카카오판교오피스.${maskData.name},${maskData.lat},${maskData.lng}">길찾기</a><p>입고 등록 시간: ${maskData.stock_at}</p> <p>업데이트 시간 : ${maskData.created_at}</p></div>` ;

    var infowindow = new kakao.maps.InfoWindow({
        content : infoHTML,
        removable : true,
    });

    kakao.maps.event.addEventListener(marker, 'click', function() {

        infowindow.open(map,marker);
    });
}