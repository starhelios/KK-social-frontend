// import React, { useEffect } from "react";
// // eslint-disable-next-line
// declare var ZoomMtg;

// // eslint-disable-next-line
// ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.0/lib", "/av");

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareJssdk();

// function Zoom({meetingId, meetingPassword, userZoomRole}) {
//   const signatureEndpoint = "https://zoom-integration-endpoint.herokuapp.com/";
//   const apiKey = "YTkH19MMRFujJw1T8W8Bag";
//   const meetingNumber = meetingId;
//   const role = userZoomRole; //role 1 is host role 0 is user
//   const leaveUrl = "http://localhost:3000";
//   const userName = "React";
//   const userEmail = "grayson@sandboxcommerce.com";
//   const passWord = meetingPassword;

//   useEffect(() => {
//     getSignature();
//   }, []);

//   function getSignature(e) {
//     // e.preventDefault();

//     fetch(signatureEndpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         meetingNumber: meetingNumber,
//         role: role,
//       }),
//     })
//       .then((res) => res.json())
//       .then((response) => {
//           if(response.signature){
//               startMeeting(response.signature);

//               console.log(response.signature);
//           }
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }
  
//   function startMeeting(signature) {
//     document.getElementById("zmmtg-root").style.display = "block";

//     ZoomMtg.init({
//         debug: true,
//       leaveUrl: leaveUrl,
//       isSupportAV: true,
//       success: (success) => {
//         console.log(success);

//         ZoomMtg.join({
//           signature: signature,
//           meetingNumber: meetingNumber,
//           userName: userName,
//           apiKey: apiKey,
//           userEmail: userEmail,
//           passWord: passWord,
//           success: (success) => {
//             console.log(success);
//           },
//           error: (error) => {
//             console.log(error);
//           },
//         });
//       },
//       error: (error) => {
//         console.log(error);
//       },
//     });
//   }
//   return (
//     <div>
//       hey Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur
//       provident nobis facere. Perferendis dolorem aut fuga, eaque quis suscipit.
//       Ullam, velit. Voluptates veritatis assumenda quia fugiat inventore tenetur
//       earum.
//     </div>
//   );
// }
// export default Zoom;
