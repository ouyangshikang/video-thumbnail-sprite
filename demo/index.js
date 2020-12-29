import { VideoThumbnail } from '../lib/index.es.js';

// 测试视频
const video = 'https://gd-filems.dancf.com/mps-output/712778ba01364c9cbc334e0b0509ac4d/to-mp4/file.mp4';

const videoThumbnail = new VideoThumbnail(video);

const thumbnailsNode = document.querySelector('.thumbnails');

const renderThumbnails = (thumbnails) => {
    thumbnails.forEach(thumbnail => {
        const img = document.createElement('img');
        img.src = thumbnail.url;
        img.style.width = '150px';
        thumbnailsNode.appendChild(img);
    });
};

console.time('video');
videoThumbnail.getThumbnails({
    interval: 0.5,
    scale: 0.5
}).then(url => {
    console.timeEnd('video');
    renderThumbnails(url);
})
