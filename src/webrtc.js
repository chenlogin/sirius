'use strict';
// 传输视频，不传输音频
const mediaStreamConstraints = {
  video: true,
  audio: false
};

// 设置只交换视频
const offerOptions = {
  offerToReceiveVideo: 1,
};

let startTime = null;

// 设置两个video，分别显示本地视频流和远端视频流
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let remoteStream;
// 建立两个对等连接对象，分表代表本地和远端
let localPeerConnection;
let remotePeerConnection;

function gotLocalMediaStream(mediaStream) {
    localVideo.srcObject = mediaStream;
    localStream = mediaStream;
    trace('Received local stream.');
    callButton.disabled = false; 
}

function handleLocalMediaStreamError(error) {
    trace(`navigator.getUserMedia error: ${error.toString()}.`);
}

function gotRemoteMediaStream(event) {
    const mediaStream = event.stream;
    remoteVideo.srcObject = mediaStream;
    remoteStream = mediaStream;
    trace('Remote peer connection received remote stream.');
}

function logVideoLoaded(event) {
    const video = event.target;
    trace(`${video.id} videoWidth: ${video.videoWidth}px, ` +
        `videoHeight: ${video.videoHeight}px.`);
}

function logResizedVideo(event) {
    logVideoLoaded(event);
    if (startTime) {
        const elapsedTime = window.performance.now() - startTime;
        startTime = null;
        trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
    }
}

localVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('loadedmetadata', logVideoLoaded);
remoteVideo.addEventListener('onresize', logResizedVideo);


function handleConnection(event) {
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if (iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = getOtherPeer(peerConnection);

        console.log(`=====123${getPeerName(peerConnection)}====`,newIceCandidate)
        otherPeer.addIceCandidate(newIceCandidate)
        .then(() => {
            handleConnectionSuccess(peerConnection);
        }).catch((error) => {
            handleConnectionFailure(peerConnection, error);
        });

        trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
            `${event.candidate.candidate}.`);
    }
}

function handleConnectionSuccess(peerConnection) {
    trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

function handleConnectionFailure(peerConnection, error) {
    trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

function handleConnectionChange(event) {
    const peerConnection = event.target;
    console.log('ICE state change event: ', event);
    trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`);
}

function setSessionDescriptionError(error) {
    trace(`Failed to create session description: ${error.toString()}.`);
}

function setDescriptionSuccess(peerConnection, functionName) {
    const peerName = getPeerName(peerConnection);
    trace(`${peerName} ${functionName} complete.`);
}

function setLocalDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

function setRemoteDescriptionSuccess(peerConnection) {
    setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

function createdOffer(description) {
    trace(`Offer from localPeerConnection:\n${description.sdp}`);

    trace('localPeerConnection setLocalDescription start.');
    localPeerConnection.setLocalDescription(description)
    .then(() => {
        setLocalDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);

    trace('remotePeerConnection setRemoteDescription start.');
    //WebRTC并没有明确说明如何信令交换，页面间可以建立WebSocket通信传输信令
    //demo代码localPeerConnection和remotePeerConnection在同一个页面，所以信令不需要WebSocket传输
    remotePeerConnection.setRemoteDescription(description)
    .then(() => {
        setRemoteDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

    trace('remotePeerConnection createAnswer start.');
    remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch(setSessionDescriptionError);
    }

function createdAnswer(description) {
    trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

    trace('remotePeerConnection setLocalDescription start.');
    remotePeerConnection.setLocalDescription(description)
    .then(() => {
        setLocalDescriptionSuccess(remotePeerConnection);
    }).catch(setSessionDescriptionError);

    trace('localPeerConnection setRemoteDescription start.');
    localPeerConnection.setRemoteDescription(description)
    .then(() => {
        setRemoteDescriptionSuccess(localPeerConnection);
    }).catch(setSessionDescriptionError);
}

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;

function startAction() {
    startButton.disabled = true;
    navigator.getUserMedia(mediaStreamConstraints, gotLocalMediaStream, handleLocalMediaStreamError)
    //本地视频采集后加入传输流，可以采用 addStream 或 addTrack 或 addTransceiver
    trace('Requesting local stream.');
}

/**
 * 创建对等连接
 * 1、Peer A实例化一个RTCPeerConnection对象，并监听onicecandidate事件；
 * 2、Peer A创建offer（offer包含SDP对象，SDP对象中包含当前音视频的相关参数） createOffer，setLocalDescription 保存SDP对象，并通过信令服务器发送给Peer B；
 * 3、Peer B收到offer后setRemoteSDP，创建answer(应答的SDP对象) createAnswer并通过信令服务器发送给Peer A；
 * 4、Peer A收到answer后setRemoteSDP；
 * 5、Peer A与Peer B互相处理完offer/answer（这个交换过程叫做信令，socket.io可以作为信令服务器），icecandidate被通知到，Peer A与Peer B交换candidate信息；（icecandidate可以理解为是获取对等端的IP地址、公网IP地址,实现网络穿透）
 * 6、连接建立完成！
 * 7、当连接建立完成之后，RTCPeerConnection会将本地的tracks轨道推送给对方，PeerA.addTrack(track, stream);
 * 8、对方接收到tracks推送时，会通知回调函数PeerB.ontrack，可以从event对象中拿到远程流媒体对象
 * 9、当互相拿到对方的流媒体对象时，语音/视频通话就成功了，将流赋给<video />标签即可
 * 
 * 实时语音/视频聊天，还提到了文件传输，这便是RTCDataChannel的功能。
 * 利用它，能传输string、ArrayBuffer、Blob(目前仅FireFox支持)类型的数据。
 * 所以，传输文本和文件不在话下。它的使用和MediaStream一样，都需要依附RTCPeerConnection
 */
function callAction() {
    callButton.disabled = true;
    hangupButton.disabled = false;

    trace('Starting call.');
    startTime = window.performance.now();

    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
        trace(`Using video device: ${videoTracks[0].label}.`);
    }
    if (audioTracks.length > 0) {
        trace(`Using audio device: ${audioTracks[0].label}.`);
    }
    // 服务器配置
    const servers = null; 

    trace('Created local peer connection object localPeerConnection.');
    localPeerConnection = new RTCPeerConnection();
    //监听onicecandidate事件，当本地与对方offer/answer握手之后
    //icecandidate时会被通知到，再通过信令服务器将candidate信息发送给对方；
    //通信候选地址交换
    localPeerConnection.addEventListener('icecandidate', handleConnection);
    localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

    trace('Created remote peer connection object remotePeerConnection.');
    remotePeerConnection = new RTCPeerConnection();
    remotePeerConnection.addEventListener('icecandidate', handleConnection);
    remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
    remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);
    
    localPeerConnection.addStream(localStream);// 后续会废弃,建议使用addTrack
    // remotePeerConnection.ontrack = function(evt){
    //     const mediaStream = evt.streams[0];
    //     remoteVideo.srcObject = mediaStream;
    // }
    // //将媒体流添加到webrtc的音视频收发器
    // localStream.getTracks().forEach(track => {
    //     localPeerConnection.addTrack(track, localStream);
    // });
    trace('Added local stream to localPeerConnection.');

    trace('localPeerConnection createOffer start.');
    localPeerConnection.createOffer(offerOptions)
    .then(createdOffer).catch(setSessionDescriptionError);
}

function hangupAction() {
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    hangupButton.disabled = true;
    callButton.disabled = false;
    trace('Ending call.');
}

startButton.addEventListener('click', startAction);
callButton.addEventListener('click', callAction);
hangupButton.addEventListener('click', hangupAction);

function getOtherPeer(peerConnection) {
    return (peerConnection === localPeerConnection) ?
    remotePeerConnection : localPeerConnection;
}

function getPeerName(peerConnection) {
    return (peerConnection === localPeerConnection) ?
    'localPeerConnection' : 'remotePeerConnection';
}

function trace(text) {
    text = text.trim();
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now, text);
}
