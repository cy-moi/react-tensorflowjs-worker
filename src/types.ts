type cocoSsdPrediction = {
  bbox: number[],
  class: string,
  score: number   
}

type handPosePrediction = {
    keypoints: number[],
    keypoints3D: number[]
}

export {
  cocoSsdPrediction,
  handPosePrediction
}