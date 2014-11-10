/**
 * Created on 10.11.2014.
 */
var localStream = null;
var pc1;
var pc2;
var servers = null;

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
RTCPeerConnection = (webkitRTCPeerConnection || mozRTCPeerConnection || msRTCPeerConnection);

var offerConstraints = {};

var streamConstraints = {
    "audio": true,
    "video": true
};

function getUserMedia_success(stream) {
    console.log("getUserMedia_success():", stream);
    localVideo1.src = URL.createObjectURL(stream);
    localStream = stream;
}

function getUserMedia_error(error) {
    console.log("getUserMedia_error():", error);
}

function getUserMedia_click() {
    console.log("getUserMedia_click()");
    navigator.getUserMedia(
        streamConstraints,
        getUserMedia_success,
        getUserMedia_error
    );
}

function pc1_createOffer_success(desc) {
    console.log("pcl_createOffer_success(): \ndesc.sdp:\n"+desc.sdp+"desc:", desc);
    pc1.setLocalDescription(desc);

    pc2_receivedOffer(desc);
}

function pc1_createOffer_error(error) {
    console.log("pc1_createOffer_error(): error:", error);
}

function pc1_onicecandidate(event) {
    if (event.candidate) {
        console.log("pc1_onicecandidate():\n"+event.candidate.candidate.replace("\r\n", ""), event.candidate);
    }

    pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
}

function pc1_onaddstream(event) {
    console.log("pc_onaddstream()");
    remoteVideo1.src = URL.createObjectURL(event.stream);
}

function createOffer_click() {
    console.log("createOffer_click()");
    pc1 = new RTCPeerConnection(servers);
    pc1.onicecandidate = pc1_onicecandidate;
    pc1.onaddstream = pc1_onaddstream;
    pc1.addStream(localStream);
    pc1.createOffer(
        pc1_createOffer_success,
        pc1_createOffer_error,
        offerConstraints
    );
}

function pc2_createAnswer_success(desc) {
    pc2.setLocalDescription(desc);
    console.log("pc2_createAnswer_success()", desc.sdp);
    pc1.setRemoteDescription(desc);
}

function pc2_createAnswer_error(error) {
    console.log('pc2_createAnswer_error():', error);
}

var answerConstraints = {
    'mandatcry': { 'offerToReceiveAudio':true, 'OfferToReceiveVideo':true }
};

function pc2_receivedOffer(desc) {
    console.log("pc2_receiveOffer()", desc);
    pc2 = new RTCPeerConnection(servers);
    pc2.onicecandidate = pc2_onicecandidate;
    pc2.onaddstream = pc2_onaddstream;
    pc2.addStream(localStream);
    pc2.setRemoteDescription( new RTCSessionDescription(desc) );
    pc2.createAnswer(
        pc2_createAnswer_success,
        pc2_createAnswer_error,
        answerConstraints
    );
}

function pc2_onicecandidate(event) {
    if (event.candidate) {
        console.log("pc2_onicecandidate():", event.candidate.candidate);
        pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
    }
}

function pc2_onaddstream(event) {
    console.log("pc_onaddstream()");
    remoteVideo2.src = URL.createObjectURL(event.stream);
}


function btnHangupClick() {
    localVideo1.src = "";
    localStream.stop();
    localStream = null;
    remoteVideo1.src = "";
    pc1.close();
    pc1 = null;
    remoteVideo2.src = "";
    pc2.close();
    pc2 = null;
}

