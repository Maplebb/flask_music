let content = document.querySelector('.content')
let lyricsDiv = document.querySelector('.lyrics');
let music_data = document.querySelector('#music-data');
let audio = document.createElement('audio');
let song_name = document.querySelector('.song-name');
let singer = document.querySelector('.singer');
let music_current_time = document.querySelector('.music-now-time');
let music_total_time = document.querySelector('.music-total-time');
let icon_play_pause = document.querySelector('#icon-play-pause');
let slider = document.querySelector('.music-played-time-bar');
let buffer = document.querySelector('.music-loaded-time-bar');
let music_bg = document.querySelector('.music-bg');
let music_next_mode = document.querySelector('#music-next-mode');
let menu_bottom = document.querySelector('.menu-bottom');
let description = document.querySelector('.description');
let all_song_des = document.querySelector('.all-song-des')
let favorite_list = document.querySelector('.favorite-list');
let jiaqian_list = document.querySelector('.jiaqian-list');
let all_song_list = document.querySelector('.all-song-list');
let music_total_time_bar = document.querySelector('.music-total-time-bar');
let music_played_time_bar = document.querySelector('.music-played-time-bar');
let music_progress_dot = document.querySelector('.music-progress-dot')


let music_data_arr = JSON.parse(music_data.getAttribute('d'));
music_data.remove();

let now_song_num = 0;
let total_songs = music_data_arr.length;
let play_state = false;
let current_lyric_index_pre;
let current_lyric_index_now;
let music_next_mode_num = 0;
let music_next_mode_arr = ["icon in-order","icon loop","icon random"];
// 0 for one by one,1 for single loop,2 for random
let content_display_mode = 0;
// 0 for lyrics,1 for song list



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
    song_name.innerHTML = music_data_arr[now_song_num][0].split('-')[0];
    singer.innerHTML = music_data_arr[now_song_num][0].split('-')[1];
    music_bg.setAttribute('style',"background-image: url(\"../static/pic/"+music_data_arr[now_song_num][2]+"\");");
    console.log(music_data_arr[now_song_num][2])
    audio.autoplay = true;
    audio.loop = false;
    // audio.load();

    music_total_time.innerHTML = "0:00";
    music_current_time.innerHTML = '0:00';
    let scroll_height = String(lyricsDiv.parentNode.offsetHeight*0.5-current_lyric_index_now*33-16)+"px";
    lyricsDiv.setAttribute('style',"transform: "+"translate3d(0px, "+scroll_height+", 0px);")
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
    if(!isNaN(Number(audio.duration)))
        music_total_time.innerHTML = String(Math.floor(Number(audio.duration) / 60)) + ":" + (Math.floor(Number(audio.duration) % 60) < 10 ? ("0" + String(Math.floor(Number(audio.duration) % 60))) : String(Math.floor(Number(audio.duration) % 60)));
    else
        music_total_time.innerHTML = "0:00";
    music_current_time.innerHTML = String(Math.floor(Number(audio.currentTime)/60)) + ":" + (Math.floor(Number(audio.currentTime)%60)<10?("0"+String(Math.floor(Number(audio.currentTime)%60))):String(Math.floor(Number(audio.currentTime)%60)));

    slider.style.width = String(audio.currentTime/audio.duration*100)+"%";
    buffer.style.width = String(audio.buffered.length*100)+"%";

    current_lyric_index_now = current_lyric();
    lyricsDiv.children[current_lyric_index_now].setAttribute("class","on")
    if(current_lyric_index_pre!=current_lyric_index_now){
        lyricsDiv.children[current_lyric_index_pre].removeAttribute("class")
        current_lyric_index_pre = current_lyric_index_now
    }
    let scroll_height = String((lyricsDiv.parentNode.offsetHeight>0?lyricsDiv.parentNode.offsetHeight:description.offsetHeight-60)*0.5-current_lyric_index_now*32-16)+"px";
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
function init() {
    lyricsDiv.innerHTML = "";
    lyricsArr = split();
    createPara();
    load_track();
    icon_play_pause.setAttribute('class', "icon icon-play");
}
// bug
function presong(){
    now_song_num = (now_song_num==0)?(total_songs-1):(now_song_num-1)%total_songs;
    init();
}
function nextsong_onorder(){
    now_song_num = (now_song_num+1)%total_songs;
    init();
}
// get random int(from 0 to max-1)
function getrandomint(max) {
    return Math.floor(Math.random()*max)
}
function nextsong_random(){
    now_song_num = getrandomint(total_songs)
    init()
}
function nextsong(){
    switch (music_next_mode_num) {
        case 0:{
            nextsong_onorder();
            break;
        }
        case 1:{
            init();
            break;
        }
        case 2:{
            nextsong_random();
            break;
        }
    }
}
audio.ontimeupdate = current;
audio.onplay = function(){
    play_state = true;
    icon_play_pause.setAttribute('class', "icon icon-pause");
};
audio.onpause = function(){
    play_state = false;
    icon_play_pause.setAttribute('class', "icon icon-play");
};
audio.onended = nextsong;

function click_next_mode(){
    music_next_mode_num = (music_next_mode_num+1)%3;
    music_next_mode.setAttribute("class",music_next_mode_arr[music_next_mode_num]);
}

function change_display(){
    switch (content_display_mode) {
        case 0:{
            content.style.display = "none";
            description.style.display = "flex";
            all_song_des.style.display = "none";
            content_display_mode += 1;
            break
        }
        case 1:{
            content.style.display = "flex";
            description.style.display = "none";
            all_song_des.style.display = "none";
            content_display_mode -= 1;
            break
        }
    }
}
function display_all_songs() {
    content.style.display = "none";
    description.style.display = "none";
    all_song_des.style.display = "flex";
    content_display_mode = 0;
}
function all_songs() {
    for (let i=0;i<music_data_arr.length;i++){
        let song = document.createElement('div');
        let song_name = document.createElement('div');
        let singer = document.createElement('div');
        song_name.innerHTML = music_data_arr[i][0].split('-')[0]
        song_name.setAttribute('class','single-song-name');
        singer.innerHTML = music_data_arr[i][0].split('-')[1];
        singer.setAttribute('class','single-song-singer')
        song.setAttribute('class', 'single-song');
        song.setAttribute('onclick','click_song_name(this.id)');
        song.setAttribute('id',String(i));
        song.append(song_name);
        song.append(singer);
        all_song_list.append(song)
    }
}
all_songs();

function favorite_song() {
    for (let i = 0; i < music_data_arr.length; i++)
    {
        if(music_data_arr[i][0] == "Just carry on-林家谦"){
            let title = document.querySelector('.favorite-title');
            title.innerHTML = "今天的音乐投递 📬";
            let song = document.createElement('div');
            song.innerHTML = music_data_arr[i][0].split("-")[0]+" - "+music_data_arr[i][0].split("-")[1];
            song.setAttribute('class', 'favorite-song');
            song.setAttribute('onclick','click_song_name(this.id)');
            song.setAttribute('id',String(i));
            favorite_list.append(song)
        }
    }
}
favorite_song();
function jiaqian_song() {
    for (let i = 0; i < music_data_arr.length; i++)
    {
        if(music_data_arr[i][0].split('-')[1] == "林家谦"){
            let title = document.querySelector('.jiaqian-title');
            title.innerHTML = "林家谦 🙇‍"
            let song = document.createElement('div');
            song.innerHTML = music_data_arr[i][0].split("-")[0];
            song.setAttribute('class', 'jiaqian-song');
            song.setAttribute('onclick','click_song_name(this.id)');
            song.setAttribute('id',String(i));
            jiaqian_list.append(song)
        }
    }
}
jiaqian_song();
function click_song_name(id) {
    now_song_num = id;
    init();
}
// music_total_time_bar.onmousedown = function (event) {
//     // let event = event || window.event;
//     let leftVal = this.getBoundingClientRect().left;
//     console.log(leftVal);
//     let that = this;
//     // 拖动一定写到 down 里面才可以
//     document.onmousemove = function(event){
//     // let event = event || window.event;
//     barleft = event.clientX - leftVal;
//     if(barleft < 0)
//       barleft = 0;
//     else if(barleft > music_total_time_bar.offsetWidth)
//       barleft = music_total_time_bar.offsetWidth;
//     music_played_time_bar.style.width = barleft +'px' ;
//
//
//     //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
//     window.getSelection ? window.getSelection().removeAllRanges() :
//     document.selection.empty();
//     }
// };
// document.onmouseup = function(){
//     document.onmousemove = null; //弹起鼠标不做任何操作
// };
music_progress_dot.addEventListener('mousedown', (e) => {
        pausesong()


        this.onmousemove = dragHandler;
        this.onmouseup = function(){
          playsong()
          this.onmousemove = null;
          this.onmouseup = null
        }
    });

    let dragHandler = (e) => {
      let progressClinetW = music_total_time_bar.clientWidth
      let startPos = music_total_time_bar.getBoundingClientRect().left


      let width = e.clientX - startPos

      music_played_time_bar.style.width = width + 'px'

      let current_Time = width / progressClinetW * audio.duration

      audio.currentTime = current_Time
    }