
import React, { useEffect, useState }from 'react';
import Canvas from '../components/Canvas';
import { isMobile, setupCamera } from '../utils';
import { CocoSsdWorker } from 'src/worker/cocossd.worker';
import { cocoSsdPrediction } from 'src/types';
import * as Comlink from 'comlink';

function App() {

  const cocoWorker : Comlink.Remote<CocoSsdWorker> = Comlink.wrap(
    new Worker(new URL(`../worker/cocossd.worker.ts`, import.meta.url))
  );

  const [video, setVid] = useState();

  useEffect(() => {
    async function initCamera() {
      const mobile = isMobile;
      const vid = await setupCamera(mobile);
      setVid(vid);
      // console.log(vid.play());
      vid.play();
    }

    initCamera();

    return () => {}

  }, [])


  const drawbbox = (
      ctx : CanvasRenderingContext2D, 
      imageData, 
      results : cocoSsdPrediction[]
    ) => {
      ctx.clearRect(0, 0, imageData.width, imageData.height)
      ctx.putImageData(imageData, 0, 0);
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#FF0000';

      if (!results) {
        console.warn('model not ready');
        return;
      }
      for (let detection of results) {
        const { bbox } = detection;
        if(bbox) {
          ctx.beginPath();
          ctx.rect(bbox[0], bbox[1], bbox[2], bbox[3]);
          ctx.stroke();
          ctx.fillText(detection.class, bbox[0], bbox[1] - 10);
          ctx.closePath();
        }
      }

  }
  
  return (
    <div>
      {video ? <Canvas draw={drawbbox} video={video} worker={cocoWorker}/> : null }
    </div>
    )
}

export default App