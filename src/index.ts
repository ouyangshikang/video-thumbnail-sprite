// 测试视频
const video = 'https://gd-filems.dancf.com/mps-output/712778ba01364c9cbc334e0b0509ac4d/to-mp4/file.mp4';


export class VideoThumbnail {
    /**
     * 视频元素
     */
    private videoElement: HTMLVideoElement;

    /**
     * canvas 元素
     */
    private canvas: HTMLCanvasElement;

    /**
     * canvas 上下文
     */
    private canvasContext: CanvasRenderingContext2D;

    /**
     * 预览图数组
     */
    private previewImages: string[]

    /**
     * @param videoUrl - 视频地址
     */
    constructor(videoUrl: string) {
        if(!videoUrl) {
            throw new Error('video url required');
        }

        this.videoElement = document.createElement('video');
        this.canvas = document.createElement('canvas');
        const context = this.canvas.getContext('2d');

        if(!context) {
            throw new Error('Could not create canvas context')
        }

        this.canvasContext = context;
        this.videoElement.src = videoUrl;
    }




}