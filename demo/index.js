import { VideoThumbnail } from '../lib/index.es.js';

const fileInput = document.getElementById('file');
const thumbnailsNode = document.querySelector('.thumbnails');
const timeNode = document.querySelector('.time');

const renderThumbnails = (thumbnails) => {
    thumbnailsNode.innerHTML = '';

    thumbnails.forEach(thumbnail => {
        const img = document.createElement('img');
        img.src = thumbnail.url;
        img.style.width = '150px';
        thumbnailsNode.appendChild(img);
    });
    timeNode.innerHTML = `共${thumbnails.length}帧， 生成时间: ${time} ms`;
};

let time = 0;

fileInput.addEventListener('change', () => {

    const file = fileInput.files[0];
    const videoUrl = URL.createObjectURL(file);
    const videoThumbnail = new VideoThumbnail(videoUrl);

    const startTime = new Date().getTime();

    videoThumbnail.getThumbnails({
        interval: 0.5,
        scale: 0.5
    }).then(thumbnails => {
        time = new Date().getTime() - startTime;
        renderThumbnails(thumbnails);
    })
});