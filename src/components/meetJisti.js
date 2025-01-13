import { useEffect, useRef } from "react";

const JitsiMeet = () => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      console.error("Jitsi API script not loaded.");
      return;
    }

    const api = new window.JitsiMeetExternalAPI("8x8.vc", {
      roomName: "vpaas-magic-cookie-e1caf5543ce644e7a0e4632ef7b0229a/SampleAppHomelessCommitteesPackWildly",
      parentNode: jitsiContainerRef.current,
      // jwt: "your-jwt-token", // Only if using premium features
    });

    return () => api.dispose(); // Cleanup when unmounting
  }, []);

  return <div ref={jitsiContainerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default JitsiMeet;
