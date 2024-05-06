screen.orientation.addEventListener("change", (event) => {
    const type = event.target.type;
    const angle = event.target.angle;
    var rows = 10;
    var cols = 30;
    console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
  });