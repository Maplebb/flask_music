let lyricsDiv = document.querySelector('.lyrics');
let music_data = document.querySelector('#music-data');
let audio = document.createElement('audio');
let song_name = document.querySelector('.song-name');
let singer = document.querySelector('.singer');
let music_current_time = document.querySelector('.music-now-time');
let music_total_time = document.querySelector('.music-total-time');
let play_pause = document.querySelector('.play-and-pause');
let icon_play_pause = document.querySelector('#icon-play-pause');
let slider = document.querySelector('.music-played-time-bar');
let buffer = document.querySelector('.music-loaded-time-bar');
let music_bg = document.querySelector('.music-bg');
let music_bg_mask = document.querySelector('.music-bg-mask');


let music_data_arr = JSON.parse(music_data.getAttribute('d'));
music_data.remove();

let now_song_num = 0;
let play_state = false;
let current_lyric_index_pre;
let current_lyric_index_now;


function split(){//把lrc歌词分割成数组，
    let split_1 =music_data_arr[now_song_num][1].split('\n');
    let length = split_1.length;
    function change(str) {
        let lrc = str.split(']');
        let timer = lrc[0].replace('[', '');
        let str_music = lrc[1];
        let time_split = timer.split(':');
        let s = +time_split[1];
        let min = +time_split[0];
        return {
            time: min * 60 + s -0.6,
            lrc: str_music//分割好到歌词和时间
        }
    }
    for (let i = 0; i < length; i++) {
        let lrcArr = split_1[i];
        split_1[i] = change(lrcArr);
    }
    return split_1
}
let lyricsArr = split();
function createPara() {
    current_lyric_index_pre=0;
    current_lyric_index_now=0;
    let len = lyricsArr.length;
    for (let i = 0; i < len; i++) {
        let lrc_li = lyricsArr[i];
        let para = document.createElement('p');
        para.innerText = lrc_li.lrc;
        lyricsDiv.appendChild(para);
    }
}
createPara();


function load_track() {
    slider.style.width = '0px';

    audio.src = "../static/mp3/"+music_data_arr[now_song_num][0]+".mp3";
    song_name.innerHTML = music_data_arr[now_song_num][0].split(' ')[0];
    singer.innerHTML = music_data_arr[now_song_num][0].split(' ')[1];
    audio.autoplay = true;
    audio.loop = true;
    // audio.load();

    music_total_time.innerHTML = "0:00";
    music_current_time.innerHTML = '0:00';
    music_bg.setAttribute('style',"background-image: url(\"../static/pic/"+music_data_arr[now_song_num][0]+".jpg\");");
}
load_track();


function change_play_state(){
    if(play_state == false){
        playsong();
    }
    else{
        pausesong()
    }
}


function playsong() {
    icon_play_pause.setAttribute('class', "icon icon-pause");
    audio.play();
    play_state = true;
}

function pausesong() {
    icon_play_pause.setAttribute('class',"icon icon-play");
    audio.pause();
    play_state = false;
}

function current(){
    music_total_time.innerHTML = String(Math.floor(Number(audio.duration)/60)) + ":" + (Math.floor(Number(audio.duration)%60)<10?("0"+String(Math.floor(Number(audio.duration)%60))):String(Math.floor(Number(audio.duration)%60)));
    music_current_time.innerHTML = String(Math.floor(Number(audio.currentTime)/60)) + ":" + (Math.floor(Number(audio.currentTime)%60)<10?("0"+String(Math.floor(Number(audio.currentTime)%60))):String(Math.floor(Number(audio.currentTime)%60)));

    slider.style.width = "calc("+String(audio.currentTime/audio.duration*100)+"%"+" - "+String(audio.currentTime/audio.duration*10)+"px)";
    buffer.style.width = "calc("+String(audio.buffered.length*100)+"%"+" - "+String(audio.buffered.length*10)+"px)";

    current_lyric_index_now = current_lyric();
    lyricsDiv.children[current_lyric_index_now].setAttribute("class","on")
    if(current_lyric_index_pre!=current_lyric_index_now){
        lyricsDiv.children[current_lyric_index_pre].removeAttribute("class")
        current_lyric_index_pre = current_lyric_index_now
    }
    let scroll_height = String(lyricsDiv.parentNode.offsetHeight*0.5-current_lyric_index_now*32-16)+"px";
    console.log("translate3d(0px, "+scroll_height+", 0px);");
    lyricsDiv.setAttribute('style',"transform: "+"translate3d(0px, "+scroll_height+", 0px);")
}

function current_lyric(){
    let time = audio.currentTime;
    let play;
    let i;
    for(i=0;i<lyricsArr.length;i++){
        play = lyricsArr[i];
        if(time-play.time<=0){
            return (i-1)<0?0:i-1;
        }
    }
    return i-1
}
audio.ontimeupdate = current;
audio.onplay = function(){
    play_state = true;
    icon_play_pause.setAttribute('class', "icon icon-pause");
}