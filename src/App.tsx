import React, {useRef} from 'react';
import './App.css';

import ReactPlayer from "react-player";
import {useLocation, useParams} from "react-router-dom";
import {useInterval} from "usehooks-ts";

function App() {
    const locationParams = useLocation();
    const videoUrl = locationParams.pathname + locationParams.search;

    const [playing, setPlaying] = React.useState(false)
    const [playbackRate, setPlaybackRate] = React.useState(1)

    const ref = useRef<ReactPlayer>(null)

    const maxRate = 2
    const dividingFactor = 250
    const calculateSpeed = (currentTime: number, maxTime: number) => {
        const speedOffset = Math.max(0, Math.min(1, (maxTime - currentTime) / dividingFactor))
        return Math.min(maxRate, 1 + speedOffset);
    }

    const adjustPlaybackRate = () => {
        if (!playing) {
            console.log("skip")
            return
        }
        setPlaying(false)
        window.setTimeout(function(){
            setPlaying(playing) //pauseしてplayすると、durationの値が更新される
            const newRate = calculateSpeed(ref.current?.getCurrentTime()!, ref.current?.getDuration()!)
            setPlaybackRate(newRate);
            console.log(`Playback Rate: ${newRate}`);
        }, 30);
    }

    const delay = 8000; //in ms
    useInterval(() => {
        adjustPlaybackRate()
    }, delay)

    return (
        <>
            <h1>弾性同期Youtubeプレイヤー</h1>
            <p>配信を遅れて視聴する際に、いい感じに早送りしてくれるプレイヤーです。</p>
            <p>遅れているほど、再生速度が速くなります。</p>
            <p>配信視聴中に巻き戻したり停止したりしても、そのうち追いつきます。</p>
            <p>{window.location.host}/{"{配信URL}"} を開くことでその配信が表示されます。</p>
            <ReactPlayer
                ref={ref}
                playing={playing}
                controls={true}
                playbackRate={playbackRate}
                url={videoUrl}
                onPlay={() => { setPlaying(true) }}
                onPause={() => { setPlaying(false) }}
            />
            <p>今の再生速度: min({maxRate}, 1 + 遅延秒数/{dividingFactor}) = <b>{playbackRate}</b></p>
        </>
    )
}

export default App;
