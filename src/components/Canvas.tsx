import React, { useRef, useEffect } from 'react';
import { getImageFromVideo } from '../utils';
import * as Comlink from 'comlink'
import { HandWorker } from '../worker/handpose.worker';

const Canvas = props => {

  const { video, draw, worker} : {video: HTMLVideoElement, draw : Function, worker: Comlink.Remote<HandWorker>} = props;

  const canvasRef = useRef(null);

  useEffect(() => {

    (async () => {
      await worker.init();
    })();

  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    canvas.height = 480;
    canvas.width = 640;

    let frameCount = 0;
    let animationFrameId = -1;
    let res = undefined;
    
    //Our draw came here
    const render = async () => {
      frameCount++
      const imageData = getImageFromVideo(video);
      if(worker.ready()) {
        res = await worker.estimate(imageData);
        // console.info(res);
      }
      draw(context, imageData, res);
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw, worker, video])
  
  return <canvas ref={canvasRef} />
}

export default Canvas