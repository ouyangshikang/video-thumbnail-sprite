interface IOptions {
    /**
     * 图片质量
     */
    quality?: number;
    /**
     * 缩放比例
     */
    scale?: number;
    /**
     * 取帧间隔时间(单位 s)
     */
    interval?: number;
    /**
     * 取帧的视频开始时间
     */
    startTime?: number;
    /**
     * 取帧的视频结束时间
     */
    endTime?: number;
    /**
     * 是否生成雪碧图
     */
    sprite?: boolean;
}

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
     * 取帧选项
     */
    private options: IOptions = {
        quality: 0.9,
        scale: 1,
        interval: 1,
        startTime: 0
    }

    /**
     * 缩略图数组
     */
    private thumbnails: {
        currentTime: number;
        url: string;
    }[] = [];

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
        this.videoElement.crossOrigin = 'anonymous';
    }

    /**
     * 获取视频的某一帧图像
     * @param time - 某一时刻
     * @param options - 取帧参数
     */
    public async getThumbnail(time: number, options: IOptions = {}): Promise<string> {
        if(this.videoElement.readyState !== 4) {
            await this.waitVideoLoaded();
        }

        options = Object.assign(this.options, options);
        const { scale, quality } = options;

        this.canvas.width = this.videoElement.videoWidth * (scale || 1);
        this.canvas.height = this.videoElement.videoHeight * (scale || 1);

        return await this.getFrameImage(time, quality!);
    }

    /**
     * 获取视频所有帧图像
     * @param options - 取帧参数
     */
    public async getThumbnails(options: IOptions = {}) {
        if(this.videoElement.readyState !== 4) {
            await this.waitVideoLoaded();
        }

        options = Object.assign(this.options, options);
        const { interval, scale, quality } = options;

        this.canvas.width = this.videoElement.videoWidth * (scale || 1);
        this.canvas.height = this.videoElement.videoHeight * (scale || 1);
        // 取帧总数
        const totalFrameCount = this.videoElement.duration / (interval || 1);

        for(let i = 0; i < totalFrameCount; i++) {
            const imageBlob = await this.getFrameImage(interval! * i, quality!);
            this.thumbnails.push({
                currentTime: interval! * i,
                url: imageBlob
            })
        }

        return this.thumbnails;
    }

    /**
     * canvas 转成 blob
     * @param canvas - 画布
     * @param quality - 输出的图片质量
     */
    public canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<string> {
        return new Promise(resolve => {
            if(canvas.toBlob) {
                canvas.toBlob(
                    blob => resolve(URL.createObjectURL(blob)),
                    'image/jpeg',
                    quality
                );
            }
            else {
                const binStr = atob(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
                const len = binStr.length;
                const arr = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                const blob = new Blob([arr], { type: 'image/jpeg' });

                resolve(URL.createObjectURL(blob));
            }
        });
    }

    /**
     * 跳转到视频某一帧，并进行绘图
     * @param time - 某一时刻
     * @param quality - 出图质量
     */
    private async getFrameImage(time: number, quality: number): Promise<string> {
        await this.seekVideo(time);

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

        return this.canvasToBlob(this.canvas, quality!);
    }

    /**
     * 等待视频元数据加载完成
     * @param maxTimeout - 最长等待时间
     */
    private waitVideoLoaded(maxTimeout = 10): Promise<void> {
        return new Promise((resolve, reject) => {
            const onLoadedHandler = () => {
                removeListener();
                resolve();
            };

            const onErrorHandler = () => {
                removeListener();
                reject('video load error');
            };

            const removeListener = () => {
                this.videoElement.removeEventListener('loadedmetadata', onLoadedHandler);
                this.videoElement.removeEventListener('error', onErrorHandler);
            };

            this.videoElement.addEventListener('loadedmetadata', onLoadedHandler);
            this.videoElement.addEventListener('error', onErrorHandler);

            if(maxTimeout) {
                setTimeout(onErrorHandler, maxTimeout * 1000);
            }
        })
    }

    /**
     * 跳转到视频的指定时间
     * @param targetTime - 要跳转的视频位置(单位: s)
     */
    private seekVideo(targetTime: number): Promise<void> {
        return new Promise(resolve => {
            const onSeekedHandler = () => {
                this.videoElement.removeEventListener('seeked', onSeekedHandler);
                resolve();
            };

            this.videoElement.addEventListener('seeked', onSeekedHandler);
            this.videoElement.currentTime = targetTime;
        });
    }
}