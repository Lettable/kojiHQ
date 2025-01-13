const VideoCall = () => {
    return (
        <iframe
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            src="https://meet.jit.si/kojiforum3733"
            style={{ height: "100%", width: "100%", border: "0px" }}
        ></iframe>
    );
};

export default VideoCall;

